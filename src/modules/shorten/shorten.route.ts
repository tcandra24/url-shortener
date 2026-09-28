import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUrlSchema } from "../../schema/url";
import { store } from "./shorten.controller";

const shorten = new Hono();

shorten.post("/", zValidator("json", createUrlSchema), store);

shorten.onError((c) => {
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

export default shorten;
