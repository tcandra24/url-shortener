import { prisma } from "@/db";

export const findByCode = (code: string) => {
  return prisma.url.findUnique({
    where: {
      shortCode: code,
    },
  });
};

export const createClick = (data: any) => {
  return prisma.click.create({
    data,
  });
};

export const updateClickCount = (id: string) => prisma.url.update({ where: { id }, data: { clickCount: { increment: 1 } } });
