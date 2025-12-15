type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function nowMs(): number {
  return Date.now();
}

function cleanupStore(maxEntries = 10_000) {
  if (store.size < maxEntries) return;
  const now = nowMs();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const candidates = [
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
    'fastly-client-ip',
  ];

  for (const headerName of candidates) {
    const value = request.headers.get(headerName);
    if (value) return value.trim();
  }

  return 'unknown';
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  cleanupStore();

  const now = nowMs();
  const existing = store.get(options.key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(options.key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds,
    };
  }

  existing.count += 1;
  store.set(options.key, existing);

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: 0,
  };
}

