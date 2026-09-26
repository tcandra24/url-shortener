import type { Context } from "hono";
import { prisma } from "../../db";
import { isUrlReachable } from "../../common/utils";
import { nanoid } from "nanoid";

export const store = async (c: Context) => {
  const { originalUrl, customCode, expiresAt } = c.req.valid("json");
  const shortCode = customCode ?? nanoid(6);

  if (customCode) {
    const existing = await prisma.url.findUnique({ where: { shortCode: customCode } });
    if (existing) {
      return c.json(
        {
          success: false,
          message: "Custom code already exists",
        },
        409,
      );
    }
  }

  if (!(await isUrlReachable(originalUrl))) {
    return c.json(
      {
        success: false,
        message: "URL is not reachable",
      },
      400,
    );
  }

  const newUrl = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      expiresAt,
    },
  });

  return c.json({
    success: true,
    shortUrl: `${c.req.url.split("/api")[0]}/${newUrl.shortCode}`,
    data: newUrl,
  });
};
