/**
 * Media URLs are served through `/api/media`, which streams the licensed
 * source same-origin. That keeps playback working where a client cannot reach
 * the upstream host directly, and avoids depending on upstream CORS headers.
 */
export function mediaSrc(url: string): string {
  if (!url) return "";
  // Anything already local (an upload, or a file in /public) is served as-is.
  if (url.startsWith("/")) return url;
  return `/api/media?src=${encodeURIComponent(url)}`;
}
