import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS } from "@/lib/constants";

/** Fan-written articles awaiting admin approval before publication (SRS FR-6). */
const FanSubmissionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },
    body: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    mediaPublicId: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, default: "" },
    /** Set once approved and mirrored into the Content collection. */
    publishedContentId: { type: Schema.Types.ObjectId, ref: "Content", default: null },
  },
  { timestamps: true },
);

export type FanSubmissionDoc = InferSchemaType<typeof FanSubmissionSchema>;

export const FanSubmission: Model<FanSubmissionDoc> =
  (models.FanSubmission as Model<FanSubmissionDoc>) ??
  model<FanSubmissionDoc>("FanSubmission", FanSubmissionSchema);
