/**
 * Token Bucket Rate Limiter (Tier-Aware)
 *
 * Each API key gets its own bucket.
 * Bucket capacity and refill rate depend on user tier.
 */

// Tier configuration — single source of truth
const TIER_LIMITS = {
  FREE: { maxTokens: 10, refillMs: 60_000 }, // 10 req/min
  PRO: { maxTokens: 50, refillMs: 60_000 }, // 50 req/min
};

// 1-api-key -> 1-bucket
const buckets = new Map();

const getBucket = (apiKey, tier = "FREE") => {
  const now = Date.now();
  const { maxTokens, refillMs } = TIER_LIMITS[tier] || TIER_LIMITS.FREE;

  if (!buckets.has(apiKey)) {
    buckets.set(apiKey, {
      tokens: maxTokens,
      lastRefill: now,
    });
  }

  const bucket = buckets.get(apiKey);
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor((elapsed / refillMs) * maxTokens);

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  return bucket;
};

const consumeToken = (apiKey, tier = "FREE") => {
  const bucket = getBucket(apiKey, tier);

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return true; // request allowed
  }

  return false; // rate limit exceeded
};

/**
 * Reset a bucket — call when tier changes so new limits apply immediately
 */
const resetBucket = (apiKey) => {
  buckets.delete(apiKey);
};

module.exports = {
  consumeToken,
  resetBucket,
  TIER_LIMITS,
};
