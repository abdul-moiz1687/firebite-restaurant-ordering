import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let orderRateLimiter;

export function getOrderRateLimiter() {
  if (orderRateLimiter) {
    return orderRateLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis environment variables are missing.");
  }

  const redis = new Redis({ url, token });

  orderRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "firebite:order-api",
  });

  return orderRateLimiter;
}