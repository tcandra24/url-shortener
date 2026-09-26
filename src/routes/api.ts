import { Hono } from "hono";

import shortenRoute from "../modules/shorten/shorten.route";
import urlRoute from "../modules/urls/url.route";

const routes = new Hono();

routes.route("/urls", urlRoute);
routes.route("/shorten", shortenRoute);

export default routes;
