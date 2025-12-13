/**
 * Simple in-memory cache with TTL (Time To Live)
 * Used to cache API responses and reduce external API calls
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached data if it exists and hasn't expired
   * @param key Cache key
   * @param maxAgeSeconds Maximum age in seconds
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string, maxAgeSeconds: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = (Date.now() - entry.timestamp) / 1000;
    if (age > maxAgeSeconds) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttlSeconds Time to live in seconds (default: 3600 = 1 hour)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    });
  }

  /**
   * Delete a specific cache entry
   * @param key Cache key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clean expired entries
   * Call this periodically to prevent memory leaks
   */
  cleanExpired(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const age = (now - entry.timestamp) / 1000;
      if (age > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance
const cacheInstance = new Cache();

// Export convenience functions
export function getCachedData<T>(key: string, maxAgeSeconds: number): T | null {
  return cacheInstance.get<T>(key, maxAgeSeconds);
}

export function setCachedData<T>(key: string, data: T, ttlSeconds: number = 3600): void {
  cacheInstance.set(key, data, ttlSeconds);
}

export function deleteCachedData(key: string): boolean {
  return cacheInstance.delete(key);
}

export function clearCache(): void {
  cacheInstance.clear();
}

export function getCacheStats() {
  return cacheInstance.getStats();
}

export function cleanExpiredCache(): number {
  return cacheInstance.cleanExpired();
}

// Clean expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanExpiredCache();
  }, 5 * 60 * 1000);
}

export default cacheInstance;
