import { findByCode, createUrl } from "./shorten.repository";
import { isUrlReachable } from "../../common/utils";

export const createUrlService = async (customCode: string, data: any) => {
  if (customCode) {
    const existing = await findByCode(customCode);
    if (existing) {
      return null;
    }
  }

  if (!(await isUrlReachable(data.originalUrl))) {
    return null;
  }

  return createUrl(data);
};
