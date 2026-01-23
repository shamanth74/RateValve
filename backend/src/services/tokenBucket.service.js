// Maximum requests allowed per minute
const MAX_TOKENS = 10;

// Refill window (1 minute)
const REFILL_INTERVAL = 60 * 1000;

// In-memory store: apiKey -> bucket state
const buckets = new Map();

/**
 * Get or create a token bucket for an API key
 */
const getBucket = (apiKey) => {
  const now = Date.now();

  // Create bucket if it doesn't exist
  if (!buckets.has(apiKey)) {
    buckets.set(apiKey, {
      tokens: MAX_TOKENS,
      lastRefill: now,
    });
  }

  const bucket = buckets.get(apiKey);

  // Calculate how much time has passed
  const timePassed = now - bucket.lastRefill;

  // Calculate tokens to refill
  const tokensToAdd = Math.floor(
    (timePassed / REFILL_INTERVAL) * MAX_TOKENS
  );

  // Refill tokens if needed
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(
      MAX_TOKENS,
      bucket.tokens + tokensToAdd
    );
    bucket.lastRefill = now;
  }

  return bucket;
};

/**
 * Consume one token for an API key
 * @returns {boolean} true if allowed, false if rate limited
 */
const consumeToken = (apiKey) => {
  const bucket = getBucket(apiKey);

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return true; // request allowed
  }

  return false; // rate limit exceeded
};

module.exports = {
  consumeToken,
};
