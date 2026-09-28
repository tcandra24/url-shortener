import type { Context } from "hono";
import { nanoid } from "nanoid";
import { createUrlService } from "./shorten.service";

export const store = async (c: Context) => {
  const { originalUrl, customCode, expiresAt } = c.req.valid("json");
  const shortCode = customCode ?? nanoid(6);

  const created = await createUrlService(shortCode, {
    originalUrl,
    shortCode,
    expiresAt,
  });

  if (!created) {
    return c.json(
      {
        success: created,
        message: "Something went wrong",
      },
      409,
    );
  }

  return c.json({
    success: true,
    shortUrl: `${c.req.url.split("/api")[0]}/${created.shortCode}`,
    data: created,
  });
};
