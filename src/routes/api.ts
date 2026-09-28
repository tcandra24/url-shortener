import { Hono } from "hono";

import dashboardRoute from "../modules/dashboard/dashboard.route";
import shortenRoute from "../modules/shorten/shorten.route";
import urlRoute from "../modules/urls/url.route";

const routes = new Hono();

routes.route("/dashboard", dashboardRoute);
routes.route("/urls", urlRoute);
routes.route("/shorten", shortenRoute);

export default routes;
