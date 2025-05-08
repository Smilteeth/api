import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import dentistRouter from '../modules/dentist/dentist.route';

const apiRouter = new Hono();

apiRouter.use('/*', authMiddleware);

apiRouter.route('/dentist', dentistRouter);

export default apiRouter;
