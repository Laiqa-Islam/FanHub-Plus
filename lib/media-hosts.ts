/**
 * Hosts the editorial media library is allowed to draw from.
 *
 * This list exists because the same set of hosts has to be declared in two
 * unrelated places, and they drifted: `/api/media` allow-listed them for
 * streaming, while `next.config.ts` never listed them for `next/image`. The
 * result was a Multimedia Center that streamed video fine but crashed rendering
 * the poster frame beside it — "hostname is not configured under images".
 *
 * Both now read from here, so adding a source host is one edit and the two
 * can't fall out of step again.
 *
 * Deliberately narrow. `/api/media` forwards a caller-supplied URL, so an open
 * list would make it an SSRF vector — anything absent is refused.
 */
export const MEDIA_SOURCE_HOSTS = [
  "media.w3.org",
  "archive.org",
  "ia600000.us.archive.org",
  "test-videos.co.uk",
  "www.soundhelix.com",
  "interactive-examples.mdn.mozilla.net",
  "commondatastorage.googleapis.com",
  "upload.wikimedia.org",
] as const;

/**
 * Hosts serving still images: the media sources above, plus our own uploads,
 * the editorial stock library, and YouTube's thumbnail CDN for embeds.
 */
export const IMAGE_SOURCE_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "i.ytimg.com",
  ...MEDIA_SOURCE_HOSTS,
] as const;
