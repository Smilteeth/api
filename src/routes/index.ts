import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import dentistRouter from '../modules/dentist/dentist.route';
import appointmentRouter from '../modules/appointment/appoinment.route';

const apiRouter = new Hono();

apiRouter.use('/*', authMiddleware);

apiRouter.route('/dentist', dentistRouter);

apiRouter.route('/appointment', appointmentRouter);

export default apiRouter;
