import apiRouter from './routes';
import authRouter from './modules/auth/auth.route';
import { Context, Hono } from 'hono';
import { authMiddleware } from './middleware/auth';

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

app.use('/api/*', authMiddleware);

app.route('/auth', authRouter);

app.route('/api', apiRouter);

export default app;
