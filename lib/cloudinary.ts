import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ROOT_FOLDER = process.env.CLOUDINARY_FOLDER || "fanhub";

export type UploadedAsset = { url: string; publicId: string };

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates and uploads a browser `File` to Cloudinary.
 *
 * `folder` is appended to the configured root, e.g. "avatars" → "fanhub/avatars".
 * Throws a message safe to show the user.
 */
export async function uploadImage(file: File, folder: string): Promise<UploadedAsset> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Upload a JPG, PNG, WebP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 5 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadedAsset>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${ROOT_FOLDER}/${folder}`,
          resource_type: "image",
          // Cap stored dimensions so a 6000px phone photo does not become the
          // source for every avatar request.
          transformation: [{ width: 1600, height: 1600, crop: "limit" }],
        },
        (error, result) => {
          if (error || !result) {
            // Cloudinary's messages are written for developers and include the
            // signing string, which is noise at best and shouldn't be shown to
            // a member. Log the real thing, surface something actionable.
            console.error("[cloudinary] upload failed:", error);

            const raw = error?.message ?? "";
            const isCredentialProblem =
              /invalid signature|api_secret|unknown api_key|api_key/i.test(raw);

            reject(
              new Error(
                isCredentialProblem
                  ? "Image uploads aren't configured correctly on this server. Your text was not submitted — please try again without an image, or contact an administrator."
                  : "That image couldn't be uploaded. Try a different file, or submit without one.",
              ),
            );
            return;
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(buffer);
  });
}

/** Removes a previously uploaded asset. Never throws — cleanup is best-effort. */
export async function destroyImage(publicId: string): Promise<void> {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // An orphaned Cloudinary asset is not worth failing the user's request for.
  }
}

export { cloudinary };
