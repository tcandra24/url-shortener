import { prisma } from "../../db";

export const findByCode = (code: string) => {
  return prisma.url.findUnique({
    where: {
      shortCode: code,
    },
  });
};

export const createUrl = (data: any) => {
  return prisma.url.create({
    data,
  });
};
