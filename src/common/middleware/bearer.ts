import { bearerAuth } from "hono/bearer-auth";

export const bearerMiddleware = bearerAuth({
  token: "OIYc9lj747TF2mRFBgVr4OMeRwr6spXaUEuz6QLqgEXcuLteCiM0Gk3Jk2x6ruHq",
  // token: process.env.ADMIN_API_KEY!,
});
