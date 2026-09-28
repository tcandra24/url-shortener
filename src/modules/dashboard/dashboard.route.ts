import { Hono } from "hono";
import { index } from "@/modules/dashboard/dashboard.controller";

const dashboard = new Hono();

dashboard.get("/", index);
dashboard.onError((c) => {
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

export default dashboard;
