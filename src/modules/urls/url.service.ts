import { countAll, deleteByCode, findAllWithPagination, findByCode, updateByCode, clickByDay, recentClicks, topReferers } from "./url.repository";

export const getAllUrls = (page: number, limit: number) => {
  return Promise.all([findAllWithPagination(page, limit), countAll()]);
};

export const updateUrl = async (code: string, data: any) => {
  const existing = await findByCode(code);
  if (!existing) return null;

  return updateByCode(code, data);
};

export const getUrl = (code: string, select?: any) => {
  return findByCode(code, select);
};

export const deleteUrl = async (code: string) => {
  const existing = await getUrl(code);
  if (!existing) return null;

  return deleteByCode(code);
};

export const analyticsUrl = async (code: string) => {
  const existing = await findByCode(code);
  if (!existing) return null;

  const totalClicks = existing.clickCount;
  const [clicksByDayData, topReferersData, recentClicksData] = await Promise.all([clickByDay(existing.id), topReferers(existing.id), recentClicks(existing.id)]);

  return {
    totalClicks,
    clicksByDayData,
    topReferersData,
    recentClicksData,
  };
};
