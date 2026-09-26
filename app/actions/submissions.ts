"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { FanSubmission, Content, ActivityLog } from "@/models";
import { requireUser, requireAdmin } from "@/lib/dal";
import { rateLimit } from "@/lib/rate-limit";
import { uploadImage } from "@/lib/cloudinary";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { fieldErrors } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { FormState } from "@/app/actions/auth";

const SubmissionSchema = z.object({
  title: z.string().trim().min(6, "Give it a title of at least 6 characters.").max(120),
  category: z.enum(CATEGORY_SLUGS as unknown as [string, ...string[]], {
    error: "Pick a channel.",
  }),
  body: z
    .string()
    .trim()
    .min(200, "Submissions need at least 200 characters — tell us something substantial.")
    .max(20000),
});

/**
 * Strips HTML from user-submitted prose.
 *
 * Submitted text is stored as plain paragraphs and only ever wrapped in <p>
 * tags by us, so nothing a member types can reach the article renderer as
 * markup. This is the reason the detail page can safely use
 * dangerouslySetInnerHTML for approved content.
 */
function toSafeParagraphs(input: string): string {
  return input
    .split(/\n{2,}/)
    .map((block) => block.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p>${block
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</p>`,
    )
    .join("\n");
}

/** Members submit fan content; it stays invisible until an admin approves it. */
export async function submitFanContent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  if (!user.emailVerified) {
    return { message: "Confirm your email address before submitting content." };
  }

  const limit = rateLimit(`submission:${user.id}`, 5, 3600);
  if (!limit.ok) {
    return { message: `You've submitted a few already. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const parsed = SubmissionSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const { title, category, body } = parsed.data;

  try {
    await connectToDatabase();

    let mediaUrl = "";
    let mediaPublicId = "";
    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      try {
        const uploaded = await uploadImage(image, "submissions");
        mediaUrl = uploaded.url;
        mediaPublicId = uploaded.publicId;
      } catch (error) {
        return { errors: { image: (error as Error).message } };
      }
    }

    await FanSubmission.create({
      userId: user.id,
      title,
      // Zod widens its enum output to string; the value is already one of
      // CATEGORY_SLUGS, so narrow it back for Mongoose's typed create.
      category: category as CategorySlug,
      body: toSafeParagraphs(body),
      mediaUrl,
      mediaPublicId,
      status: "pending",
    });

    await ActivityLog.create({
      userId: user.id,
      action: "submitted-content",
      label: `Submitted “${title}”`,
      href: "/submit",
    });
  } catch (error) {
    console.error("[submissions] create failed:", error);
    return { message: "We couldn't save your submission. Please try again." };
  }

  revalidatePath("/submit");
  return { success: true, message: "Submitted. An administrator will review it shortly." };
}

/**
 * Approving publishes a copy into the Content collection, which is what the
 * Explorer reads. Rejecting leaves a note and publishes nothing.
 */
export async function reviewSubmission(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 500);

  if (!id || !["approved", "rejected"].includes(decision)) {
    return { message: "That review action wasn't recognised." };
  }

  try {
    await connectToDatabase();
    const submission = await FanSubmission.findById(id);
    if (!submission) return { message: "That submission no longer exists." };
    if (submission.status !== "pending") {
      return { message: "That submission has already been reviewed." };
    }

    if (decision === "approved") {
      // Keep slugs unique — two members can easily submit the same title.
      const base = slugify(submission.title);
      let slug = base;
      let suffix = 2;
      while (await Content.exists({ slug })) {
        slug = `${base}-${suffix}`;
        suffix += 1;
      }

      const published = await Content.create({
        title: submission.title,
        slug,
        category: submission.category,
        type: "article",
        summary: submission.body.replace(/<[^>]*>/g, "").slice(0, 180),
        body: submission.body,
        coverImage: submission.mediaUrl,
        genre: ["Fan submission"],
        tags: ["Fan submission", submission.category],
        releaseDate: new Date(),
        status: "published",
        authorId: submission.userId,
      });

      submission.publishedContentId = published._id;
    }

    submission.status = decision as "approved" | "rejected";
    submission.reviewedBy = admin.id as never;
    submission.reviewedAt = new Date();
    submission.reviewNote = note;
    await submission.save();
  } catch (error) {
    console.error("[submissions] review failed:", error);
    return { message: "We couldn't record that decision. Please try again." };
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/explore");
  return { success: true, message: `Submission ${decision}.` };
}
