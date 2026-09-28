import { Hono } from "hono";

import routes from "@/routes";
import apiRoutes from "@/routes/api";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { apiRateLimiter } from "@/common/middleware/rate-limit";

const app = new Hono();
app.use("*", logger());
routes.use("*", apiRateLimiter);

app.use("/api/*", cors());

app.route("/", routes);
app.route("/api", apiRoutes);

export default { fetch: app.fetch };
