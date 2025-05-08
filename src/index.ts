import { Hono } from "hono";

import fatherRoutes from "./modules/father/father.routes"; 


const app = new Hono();

/**
 * Rutas del módulo de padres.
 */
app.route("/fathers", fatherRoutes);

app.get("/", (c) => {
  return c.json({
    message: "Bienvenido a a la API de smiltheet",
    _links: [
      {
        self: {
          href: "/",
          method: "GET",
        },
      },
      {
        href: "/greet",
        method: "GET",
      },
    ],
  });
});

app.get("/greet", (c) => {
  const name = c.req.query("name") || "Mundo";
  return c.json({
    message: `Hola, ${name}!`,
    _links: [
      {
        self: {
          href: `/greet${name ? `?name=${name}` : ""}`,
          method: "GET",
        },
      },
    ],
  });
});

export default app;
