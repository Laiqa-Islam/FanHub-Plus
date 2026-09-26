/**
 * Shared media vocabulary for fan submissions (v2 Phase 10).
 *
 * Deliberately free of any server-only import: the browser needs these rules to
 * build `accept` attributes and reject a file before spending a member's upload
 * bandwidth, and the server needs the identical rules to enforce them. One
 * table, two readers — a client-side check is a courtesy, never the boundary.
 */

export const MEDIA_KINDS = ["image", "audio", "video"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export type MediaRule = {
  label: string;
  /** MIME types accepted on upload. */
  mimes: readonly string[];
  /** Cloudinary `format` values accepted back from the verified asset. */
  formats: readonly string[];
  maxBytes: number;
  /** Cloudinary resource_type. Audio rides the video pipeline. */
  resourceType: "image" | "video";
};

const MB = 1024 * 1024;

export const MEDIA_RULES: Record<MediaKind, MediaRule> = {
  image: {
    label: "image",
    mimes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
    formats: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
    maxBytes: 5 * MB,
    resourceType: "image",
  },
  audio: {
    label: "audio",
    mimes: ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "audio/webm", "audio/flac"],
    formats: ["mp3", "m4a", "aac", "ogg", "oga", "wav", "webm", "flac"],
    maxBytes: 20 * MB,
    // Cloudinary has no "audio" resource_type — audio is handled by the video
    // pipeline, which is also what gives us duration metadata for free.
    resourceType: "video",
  },
  video: {
    label: "video",
    mimes: ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"],
    formats: ["mp4", "webm", "mov", "mkv", "m4v"],
    maxBytes: 60 * MB,
    resourceType: "video",
  },
};

export function isMediaKind(value: unknown): value is MediaKind {
  return typeof value === "string" && (MEDIA_KINDS as readonly string[]).includes(value);
}

/** Value for an `<input type="file" accept="…">`. */
export function acceptAttribute(kind: MediaKind): string {
  return MEDIA_RULES[kind].mimes.join(",");
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) {
    const mb = bytes / MB;
    // Whole numbers read better on a cap ("60 MB", not "60.0 MB").
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Client-side pre-flight. Returns an error message, or null when acceptable.
 *
 * Browsers report `type` from the file extension, so this catches honest
 * mistakes and nothing more — `verifyUploadedAsset` re-checks against what
 * Cloudinary actually stored.
 */
export function checkFile(file: { type: string; size: number }, kind: MediaKind): string | null {
  const rule = MEDIA_RULES[kind];
  if (!rule.mimes.includes(file.type)) {
    return `That doesn't look like ${rule.label === "image" ? "an" : "a"} ${rule.label} file. Accepted: ${rule.formats.join(", ")}.`;
  }
  if (file.size > rule.maxBytes) {
    return `Keep ${rule.label} under ${formatBytes(rule.maxBytes)} — that file is ${formatBytes(file.size)}.`;
  }
  return null;
}

// ── Submission formats ──────────────────────────────────────────────────────

export const SUBMISSION_FORMATS = ["article", "gallery", "audio", "video", "embed"] as const;
export type SubmissionFormat = (typeof SUBMISSION_FORMATS)[number];

export const GALLERY_MIN = 2;
export const GALLERY_MAX = 8;

export type FormatSpec = {
  label: string;
  /** One line under the format name in the picker. */
  blurb: string;
  /** Which upload widget the form shows, if any. */
  uploadKind: MediaKind | null;
  multiple: boolean;
  /** Does this format carry media the member is asserting they created? */
  requiresOwnWork: boolean;
  /** Minimum characters of prose. Media formats need less than an essay. */
  minBody: number;
};

export const FORMAT_SPECS: Record<SubmissionFormat, FormatSpec> = {
  article: {
    label: "Written piece",
    blurb: "A theory, review, build log or explainer. Optional cover image.",
    uploadKind: "image",
    multiple: false,
    requiresOwnWork: false,
    minBody: 200,
  },
  gallery: {
    label: "Photo set",
    blurb: `${GALLERY_MIN}–${GALLERY_MAX} of your own photos, each with a caption.`,
    uploadKind: "image",
    multiple: true,
    requiresOwnWork: true,
    minBody: 80,
  },
  audio: {
    label: "Audio",
    blurb: "A recording you made — commentary, a cover, original score.",
    uploadKind: "audio",
    multiple: false,
    requiresOwnWork: true,
    minBody: 80,
  },
  video: {
    label: "Video",
    blurb: "Footage you shot and edited yourself.",
    uploadKind: "video",
    multiple: false,
    requiresOwnWork: true,
    minBody: 80,
  },
  embed: {
    label: "Link to a platform",
    blurb: "YouTube, Vimeo, Spotify or SoundCloud. Nothing is copied to our servers.",
    uploadKind: null,
    multiple: false,
    requiresOwnWork: false,
    minBody: 80,
  },
};

export function isSubmissionFormat(value: unknown): value is SubmissionFormat {
  return typeof value === "string" && (SUBMISSION_FORMATS as readonly string[]).includes(value);
}
