const FALLBACK_URL = "/";
const DUMMY_BASE_URL = "http://google.com";

// It ensures that the callback URL is safe and prevents open redirection security vulnerability
export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
): string {
  if (!callbackUrl || typeof callbackUrl !== "string") return FALLBACK_URL;

  try {
    const url = new URL(callbackUrl, DUMMY_BASE_URL);

    if (url.origin === DUMMY_BASE_URL) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    return FALLBACK_URL;
  }

  return FALLBACK_URL;
}
