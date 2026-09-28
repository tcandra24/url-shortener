import type { Context } from "hono";
import { getAllUrls, updateUrl, getUrl, deleteUrl, analyticsUrl } from "./url.service";

export const index = async (c: Context) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");

  const [urls, total] = await getAllUrls(page, limit);

  return c.json({
    success: true,
    data: urls,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const update = async (c: Context) => {
  const code = c.req.param("code") as string;
  const data = c.req.valid("json");

  const updated = await updateUrl(code, data);
  if (!updated) {
    return c.json(
      {
        success: false,
        message: "Not Found",
      },
      404,
    );
  }

  return c.json({
    success: true,
    data: updated,
  });
};

export const stats = async (c: Context) => {
  const code = c.req.param("code") as string;
  const url = await getUrl(code, { shortCode: true, clickCount: true, createdAt: true });

  if (!url) return c.json({ success: false, message: "Not found" }, 404);
  return c.json({ success: true, data: url });
};

export const destroy = async (c: Context) => {
  const code = c.req.param("code") as string;
  const deleted = await deleteUrl(code);

  if (!deleted) return c.json({ success: false, message: "Not found" }, 404);

  return c.json({
    success: true,
    message: "Link deleted successfully",
  });
};

export const analytics = async (c: Context) => {
  const code = c.req.param("code") as string;

  const analyticsData = await analyticsUrl(code);
  if (!analyticsData) return c.json({ success: false, message: "Not found" }, 404);

  return c.json({ success: true, data: analyticsData });
};
