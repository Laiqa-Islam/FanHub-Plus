import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS, MERCH_TAGS } from "@/lib/constants";

/**
 * Showcase-only merchandise (SRS §1.5): there is deliberately no price field,
 * cart, order or payment path anywhere in the application.
 */
const MerchandiseItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },

    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    /** Additional gallery shots. */
    gallery: [{ type: String }],

    tag: { type: String, enum: MERCH_TAGS, default: "Collectible", index: true },
    /** Drives the "Upcoming releases" listing. */
    isUpcoming: { type: Boolean, default: false, index: true },
    releaseDate: { type: Date, default: null },

    viewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

MerchandiseItemSchema.index({ name: "text", description: "text" });

export type MerchandiseItemDoc = InferSchemaType<typeof MerchandiseItemSchema>;

export const MerchandiseItem: Model<MerchandiseItemDoc> =
  (models.MerchandiseItem as Model<MerchandiseItemDoc>) ??
  model<MerchandiseItemDoc>("MerchandiseItem", MerchandiseItemSchema);
