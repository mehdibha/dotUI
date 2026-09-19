/** Route `head` links for pages that load Google-hosted faces. Its own module:
 *  route heads sit in the entry chunk, and lib/fonts.ts carries the catalog. */
export const GOOGLE_FONTS_PRECONNECT = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous" as const,
  },
]
