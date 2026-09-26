import { Hono } from "hono";

import urlRoute from "../modules/urls/url.route";

const routes = new Hono();

routes.route("/urls", urlRoute);

export default routes;
