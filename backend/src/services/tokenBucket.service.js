const MAX_TOKENS = 10;

const REFILL_INTERVAL = 60 * 1000;

// 1-api-key -> 1-bucket
const buckets = new Map();


const getBucket = (apiKey) => {
  const now = Date.now();

  
  if (!buckets.has(apiKey)) {
    buckets.set(apiKey, {
      tokens: MAX_TOKENS,
      lastRefill: now,
    });
  }

  const bucket = buckets.get(apiKey);

  const timePassed = now - bucket.lastRefill;

  const tokensToAdd = Math.floor(
    (timePassed / REFILL_INTERVAL) * MAX_TOKENS
  );

  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(
      MAX_TOKENS,
      bucket.tokens + tokensToAdd
    );
    bucket.lastRefill = now;
  }

  return bucket;
};

const consumeToken = (apiKey) => {
  const bucket = getBucket(apiKey);

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return true;              // request allowed
  }

  return false;           // rate limit exceded
};

module.exports = {
  consumeToken,
};
