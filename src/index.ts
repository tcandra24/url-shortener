import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { prisma } from "./db";
import { createUrlSchema, updateUrlSchema } from "./schema/url";

import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();
app.use("*", logger());
app.use("/api/*", cors());

async function isUrlReachable(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

app.get("/api/urls", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "1");

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.url.count(),
  ]);

  return c.json({
    success: true,
    data: urls,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

app.put("/api/urls/:code", zValidator("json", updateUrlSchema), async (c) => {
  const code = c.req.param("code");
  const data = c.req.valid("json");

  const existing = await prisma.url.findUnique({ where: { shortCode: code } });
  if (!existing) {
    return c.json(
      {
        success: false,
        message: "Not Found",
      },
      404,
    );
  }

  const updated = await prisma.url.update({
    where: {
      shortCode: code,
    },
    data,
  });

  return c.json({
    success: true,
    data: updated,
  });
});

app.post("/api/shorten", zValidator("json", createUrlSchema), async (c) => {
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
});

app.get("/:code", async (c) => {
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
});

app.get("/api/urls/:code/stats", async (c) => {
  const code = c.req.param("code");
  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { shortCode: true, clickCount: true, createdAt: true },
  });

  if (!url) return c.json({ success: false, message: "Not found" }, 404);
  return c.json({ success: true, data: url });
});

app.delete("/api/urls/:code", async (c) => {
  const code = c.req.param("code");
  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { shortCode: true, clickCount: true, createdAt: true },
  });

  if (!url) return c.json({ success: false, message: "Not found" }, 404);

  await prisma.url.delete({ where: { shortCode: code } });
  return c.json({ success: true, message: "Link deleted successfully" });
});

export default { fetch: app.fetch };
