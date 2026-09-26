import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { index, show, update, destroy } from "./url.controller";
import { updateUrlSchema } from "../../schema/url";

const url = new Hono();

url.get("/", index);
url.put("/:code", zValidator("json", updateUrlSchema), update);
url.get("/:code/stats", show);
url.delete("/:code", destroy);

export default url;
