import { prisma } from "@/db";

export const urlCount = () => prisma.url.count();

export const clickCount = () => prisma.click.count();

export const urlActiveCount = () => prisma.url.count({ where: { isActive: true } });

export const topUrls = () => {
  return prisma.url.findMany({
    orderBy: { clickCount: "desc" },
    take: 5,
    select: { shortCode: true, originalUrl: true, clickCount: true },
  });
};
