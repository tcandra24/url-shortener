import { Hono } from "hono";

import appRoute from "@/modules/app.route";

const routes = new Hono();

routes.route("/", appRoute);

export default routes;
