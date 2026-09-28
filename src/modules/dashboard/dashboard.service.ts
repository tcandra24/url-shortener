import { urlCount, clickCount, urlActiveCount, topUrls } from "@/modules/dashboard/dashboard.repository";

export const getDashboardData = () => {
  return Promise.all([urlCount(), clickCount(), urlActiveCount(), topUrls()]);
};
