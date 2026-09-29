import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUrlSchema } from "@/schema/url";
import { store } from "@/modules/shorten/shorten.controller";
import { HTTPException } from "hono/http-exception";

const shorten = new Hono();

shorten.post("/", zValidator("json", createUrlSchema), store);

shorten.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status);
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default shorten;
