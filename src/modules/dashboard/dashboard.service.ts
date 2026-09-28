import { urlCount, clickCount, urlActiveCount, topUrls } from "./dashboard.repository";

export const getDashboardData = () => {
  return Promise.all([urlCount(), clickCount(), urlActiveCount(), topUrls()]);
};
