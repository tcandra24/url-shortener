import type { Context } from "hono";
import { countAccessClicks } from "./app.service";

export const show = async (c: Context) => {
  const code = c.req.param("code") as string;

  const urlAccess = await countAccessClicks(code, {
    ipAddress: c.req.header("x-forwarded-for"),
    userAgent: c.req.header("user-agent"),
    referer: c.req.header("referer"),
  });

  if (!urlAccess) {
    return c.json(
      {
        success: false,
        message: "URL not found or inactive",
      },
      404,
    );
  }

  return c.redirect(urlAccess.originalUrl, 302);
};
