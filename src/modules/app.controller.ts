import type { Context } from "hono";
import { prisma } from "../db";

export const show = async (c: Context) => {
  const code = c.req.param("code");
  const url = await prisma.url.findUnique({ where: { shortCode: code } });

  if (!url || !url.isActive) {
    return c.json(
      {
        success: false,
        message: "URL not found or inactive",
      },
      404,
    );
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    return c.json(
      {
        success: false,
        message: "URL has expired",
      },
      410,
    );
  }

  prisma.click
    .create({
      data: {
        urlId: url.id,
        ipAddress: c.req.header("x-forwarded-for"),
        userAgent: c.req.header("user-agent"),
        referer: c.req.header("referer"),
      },
    })
    .then(() => {
      prisma.url.update({ where: { id: url.id }, data: { clickCount: { increment: 1 } } });
    });

  return c.redirect(url.originalUrl, 302);
};
