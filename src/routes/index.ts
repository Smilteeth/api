import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import dentistRouter from '../modules/dentist/dentist.route';
import appointmentRouter from '../modules/appointment/appoinment.route';
import childRouter from '../modules/child/child.route';

const apiRouter = new Hono();

apiRouter.use('/*', authMiddleware);

apiRouter.route('/dentist', dentistRouter);

apiRouter.route('/appointment', appointmentRouter);

apiRouter.route('/child', childRouter);

export default apiRouter;
