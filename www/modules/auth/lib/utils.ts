/**
 * Validates and sanitizes a callback URL to prevent open redirect vulnerabilities.
 * Only allows relative paths within the application.
 *
 * @param callbackUrl - The URL to validate
 * @param fallback - The fallback URL if validation fails (default: "/")
 * @returns A safe validated URL or the fallback
 */
export function validateCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback: string = "/",
): string {
  // If no callback URL provided, return fallback
  if (!callbackUrl) {
    return fallback;
  }

  try {
    // Decode the URL in case it's encoded
    const decoded = decodeURIComponent(callbackUrl);

    // Must start with / (relative path)
    if (!decoded.startsWith("/")) {
      return fallback;
    }

    // Prevent protocol-relative URLs (//example.com)
    if (decoded.startsWith("//")) {
      return fallback;
    }

    // Prevent URLs with protocols
    if (decoded.includes("://")) {
      return fallback;
    }

    // Prevent URLs with @ (potential credential injection)
    if (decoded.includes("@")) {
      return fallback;
    }

    // Additional check: ensure it's a valid URL path
    // This prevents malformed URLs while allowing query params and hashes
    const urlPattern = /^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/;
    if (!urlPattern.test(decoded)) {
      return fallback;
    }

    return decoded;
  } catch {
    // If any error occurs during validation, return fallback
    return fallback;
  }
}
