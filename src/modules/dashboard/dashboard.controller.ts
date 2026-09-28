import type { Context } from "hono";
import { getDashboardData } from "@/modules/dashboard/dashboard.service";

export const index = async (c: Context) => {
  const [totalUrls, totalClicks, activeUrls, topUrls] = await getDashboardData();

  return c.json({
    success: true,
    data: { totalUrls, totalClicks, activeUrls, topUrls },
  });
};
