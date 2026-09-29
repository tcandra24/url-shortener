import { bearerAuth } from "hono/bearer-auth";

export const bearerMiddleware = bearerAuth({
  token: process.env.ADMIN_API_KEY!,
});
