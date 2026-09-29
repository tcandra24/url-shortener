import { createClick, findByCode, updateClickCount } from "@/modules/app.repository";

export const countAccessClicks = async (code: string, data: any) => {
  const url = await findByCode(code);

  if (!url || !url.isActive) {
    return null;
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    return null;
  }

  createClick({
    urlId: url.id,
    ...data,
  })
    .then(() => updateClickCount(url.id))
    .catch((err) => console.log(err));

  return url;
};
