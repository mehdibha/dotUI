interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached value or compute and cache it
 */
export async function cached<T>(
  key: string,
  compute: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }

  const data = await compute();
  cache.set(key, { data, timestamp: Date.now() });

  return data;
}

/**
 * Generate cache key for style + component combination
 */
export function getCacheKey(
  styleName: string,
  componentName: string,
  colorFormat: string,
): string {
  return `${styleName}:${componentName}:${colorFormat}`;
}

/**
 * Clear cache (useful for development)
 */
export function clearCache(): void {
  cache.clear();
}
