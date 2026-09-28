import { rateLimiter } from "hono-rate-limiter";

export const apiRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "anonymous",
  handler: (c) => {
    return c.json(
      {
        success: false,
        message: "Too many requests",
      },
      429,
    );
  },
});
