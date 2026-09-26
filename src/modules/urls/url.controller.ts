import type { Context } from "hono";
import { prisma } from "../../db";

export const index = async (c: Context) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");

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
};

export const update = async (c: Context) => {
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
};

export const show = async (c: Context) => {
  const code = c.req.param("code");
  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { shortCode: true, clickCount: true, createdAt: true },
  });

  if (!url) return c.json({ success: false, message: "Not found" }, 404);
  return c.json({ success: true, data: url });
};

export const destroy = async (c: Context) => {
  const code = c.req.param("code");
  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { shortCode: true, clickCount: true, createdAt: true },
  });

  if (!url) return c.json({ success: false, message: "Not found" }, 404);

  await prisma.url.delete({ where: { shortCode: code } });
  return c.json({ success: true, message: "Link deleted successfully" });
};
