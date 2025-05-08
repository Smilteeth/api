import apiRouter from './routes';
import authRouter from './modules/auth/auth.route';
import { Context, Hono } from 'hono';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

app.use('/api/*', authMiddleware);

app.route('/auth', authRouter);

app.route('/api', apiRouter);

export default app;
