import { Hono } from "hono";
import { show } from "./app.controller";

const app = new Hono();

app.get("/:code", show);

export default app;
