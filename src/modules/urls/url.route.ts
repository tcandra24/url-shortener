import type { Context } from "hono";
import { Hono } from "hono";
import { every } from "hono/combine";
import { HTTPException } from "hono/http-exception";

import { zValidator } from "@hono/zod-validator";
import { index, stats, update, destroy, analytics } from "./url.controller";
import { updateUrlSchema } from "../../schema/url";
import { bearerMiddleware } from "../../common/middleware/bearer";
import { success } from "zod";

const url = new Hono();

url.get("/", index);
url.put("/:code", every(zValidator("json", updateUrlSchema), bearerMiddleware), update);
url.get("/:code/stats", stats);
url.get("/:code/analytics", analytics);
url.delete("/:code", bearerMiddleware, destroy);

url.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message || "Unauthorized",
      },
      err.status,
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

export default url;
