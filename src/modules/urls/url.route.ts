import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";
import { index, stats, update, destroy, analytics } from "./url.controller";
import { updateUrlSchema } from "../../schema/url";
import { HTTPException } from "hono/http-exception";

const url = new Hono();

url.get("/", index);
url.put("/:code", zValidator("json", updateUrlSchema), update);
url.get("/:code/stats", stats);
url.get("/:code/analytics", analytics);
url.delete("/:code", destroy);

url.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status);
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default url;
