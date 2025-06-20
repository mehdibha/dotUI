import { type ComponentResolutionResult } from "./registry-resolver";

// Simple in-memory cache with TTL
class ComponentCache {
  private cache = new Map<
    string,
    { data: ComponentResolutionResult; expires: number }
  >();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(
    userName: string,
    styleName: string,
    componentName: string,
  ): string {
    return `${userName}:${styleName}:${componentName}`;
  }

  get(
    userName: string,
    styleName: string,
    componentName: string,
  ): ComponentResolutionResult | null {
    const key = this.getCacheKey(userName, styleName, componentName);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(
    userName: string,
    styleName: string,
    componentName: string,
    data: ComponentResolutionResult,
  ): void {
    const key = this.getCacheKey(userName, styleName, componentName);
    this.cache.set(key, {
      data,
      expires: Date.now() + this.TTL,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const componentCache = new ComponentCache();

// Cleanup expired entries every 10 minutes
if (typeof window === "undefined") {
  // Only on server
  setInterval(
    () => {
      componentCache.cleanup();
    },
    10 * 60 * 1000,
  );
}
