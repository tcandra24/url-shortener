import { Hono } from "hono";
import { index } from "@/modules/dashboard/dashboard.controller";
import { HTTPException } from "hono/http-exception";

const dashboard = new Hono();

dashboard.get("/", index);
dashboard.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status);
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default dashboard;
