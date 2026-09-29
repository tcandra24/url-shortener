import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import dashboardRoute from "@/modules/dashboard/dashboard.route";
import shortenRoute from "@/modules/shorten/shorten.route";
import urlRoute from "@/modules/urls/url.route";

import { bearerMiddleware } from "@/common/middleware/bearer";

const routes = new Hono();

routes.use("*", bearerMiddleware);
routes.route("/dashboard", dashboardRoute);
routes.route("/urls", urlRoute);
routes.route("/shorten", shortenRoute);
routes.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message || "Unauthorized",
      },
      err.status,
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

export default routes;
