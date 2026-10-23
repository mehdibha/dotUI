// The /internal labs run in dev and on Vercel previews, never on dotui.org.
export const INTERNAL_PAGES =
  import.meta.env.DEV || import.meta.env.VERCEL_ENV === "preview"
