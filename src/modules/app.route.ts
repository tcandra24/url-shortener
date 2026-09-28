import { Hono } from "hono";
import { show } from "./app.controller";

const app = new Hono();

app.get("/:code", show);
app.onError((c) => {
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

export default app;
