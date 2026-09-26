import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS, CONTENT_TYPES } from "@/lib/constants";
import { EMBED_PROVIDERS } from "@/lib/embeds";
import { MediaAssetSchema } from "./media-asset";

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

    /**
     * Ordered plates for an image piece (v2 Phase 12). `coverImage` stays the
     * single representative still used by cards and share previews; this is the
     * set the gallery walks through.
     */
    gallery: { type: [MediaAssetSchema], default: [] },

    /**
     * Embedded player, stored as provider + id rather than a URL. See
     * `lib/embeds.ts` — the URL is rebuilt at render time, never persisted.
     */
    embedProvider: { type: String, enum: [...EMBED_PROVIDERS, ""], default: "" },
    embedId: { type: String, default: "" },

    /** Transcript for audio and video, shown under the player (v2 Phase 16). */
    transcript: { type: String, default: "" },

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
