import { prisma } from "../../db";

export const findAllWithPagination = (page: number, limit: number) => {
  return prisma.url.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
};

export const countAll = () => prisma.url.count();

export const findByCode = (code: string, select?: any) => {
  return prisma.url.findUnique({
    where: {
      shortCode: code,
    },
    select,
  });
};

export const updateByCode = (code: string, data: any) => {
  return prisma.url.update({
    where: {
      shortCode: code,
    },
    data,
  });
};

export const deleteByCode = (code: string) => prisma.url.delete({ where: { shortCode: code } });

export const clickByDay = async (id: string) => {
  const rows = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
    SELECT DATE("clicked_at") as date, COUNT(*) as count
    FROM clicks
    WHERE "url_id" = ${id}
      AND "clicked_at" >= NOW() - INTERVAL '7 days'
    GROUP BY DATE("clicked_at")
    ORDER BY date ASC
  `;
  return rows.map((row) => ({ date: row.date, count: Number(row.count) }));
};

export const topReferers = (id: string) => {
  return prisma.click.groupBy({
    by: ["referer"],
    where: { urlId: id, referer: { not: null } },
    _count: { referer: true },
    orderBy: { _count: { referer: "desc" } },
    take: 5,
  });
};

export const recentClicks = (id: string) => {
  return prisma.click.findMany({
    where: { urlId: id },
    orderBy: { clickedAt: "desc" },
    take: 10,
    select: { ipAddress: true, userAgent: true, referer: true, clickedAt: true },
  });
};
