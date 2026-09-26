import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUrlSchema } from "../../schema/url";
import { store } from "./shorten.controller";

const shorten = new Hono();

shorten.post("/", zValidator("json", createUrlSchema), store);

export default shorten;
