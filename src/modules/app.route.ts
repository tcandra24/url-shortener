import { Hono } from "hono";
import { show } from "@/modules/app.controller";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/:code", show);
app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status);
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default app;
