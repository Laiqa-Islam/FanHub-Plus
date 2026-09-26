import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS, CONTENT_TYPES } from "@/lib/constants";

/**
 * The central content record: featured articles, videos, audio clips and image
 * galleries all live here, discriminated by `type`. Powers the Content Explorer
 * (SRS FR-3) and its search / filter / sort surface.
 */
const ContentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },
    type: { type: String, enum: CONTENT_TYPES, required: true, index: true },

    summary: { type: String, default: "" },
    /** Rich-text body (HTML) for articles. */
    body: { type: String, default: "" },

    coverImage: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },

    /** Direct media file the player streams, for video and audio pieces. */
    mediaUrl: { type: String, default: "" },
    /** Still shown before playback begins. */
    mediaPoster: { type: String, default: "" },
    /** Licence/attribution line, displayed beneath the player. */
    mediaCredit: { type: String, default: "" },
    mediaRuntime: { type: String, default: "" },
    /** Admin-controlled media tagging (SRS FR-5). */
    mediaTags: [{ type: String }],

    genre: [{ type: String }],
    tags: [{ type: String }],
    releaseDate: { type: Date, default: null, index: true },

    viewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0, index: true },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

// Text index backing the Explorer's keyword search.
ContentSchema.index({ title: "text", summary: "text", tags: "text" });

ContentSchema.virtual("averageRating").get(function () {
  return this.ratingCount > 0 ? this.ratingSum / this.ratingCount : 0;
});

export type ContentDoc = InferSchemaType<typeof ContentSchema>;

export const Content: Model<ContentDoc> =
  (models.Content as Model<ContentDoc>) ?? model<ContentDoc>("Content", ContentSchema);
