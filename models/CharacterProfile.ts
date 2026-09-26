import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS } from "@/lib/constants";

/** Card-based character profiles (SRS FR-6). */
const CharacterProfileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },

    /** The franchise the character belongs to, e.g. "Jujutsu Kaisen". */
    franchise: { type: String, default: "", index: true },
    bio: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },

    traits: [{ type: String }],
    debutYear: { type: Number, default: null },
    viewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

CharacterProfileSchema.index({ name: "text", franchise: "text", traits: "text" });

export type CharacterProfileDoc = InferSchemaType<typeof CharacterProfileSchema>;

export const CharacterProfile: Model<CharacterProfileDoc> =
  (models.CharacterProfile as Model<CharacterProfileDoc>) ??
  model<CharacterProfileDoc>("CharacterProfile", CharacterProfileSchema);
