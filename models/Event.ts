import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORY_SLUGS, EVENT_TYPES } from "@/lib/constants";

/**
 * Conventions, meetups and screenings for the location-aware discovery map and
 * the city-filterable calendar (SRS FR-10).
 */
const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },
    type: { type: String, enum: EVENT_TYPES, default: "convention", index: true },

    description: { type: String, default: "" },
    venue: { type: String, default: "" },
    city: { type: String, required: true, index: true },
    country: { type: String, default: "" },

    /**
     * GeoJSON point — a 2dsphere index lets us answer "conventions near me"
     * with $near once the browser hands us coordinates.
     */
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },

    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, default: null },
    ticketUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isHighlight: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

EventSchema.index({ location: "2dsphere" });

export type EventDoc = InferSchemaType<typeof EventSchema>;

export const Event: Model<EventDoc> =
  (models.Event as Model<EventDoc>) ?? model<EventDoc>("Event", EventSchema);
