import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import dentistRouter from '../modules/dentist/dentist.route';
import appointmentRouter from '../modules/appointment/appoinment.route';
import courseRouter from '../modules/course/course.route';
import childRouter from '../modules/child/child.route';
import { handleError } from '../middleware/error';
import transactionRouter from '../modules/transaction/transaction.route';

const apiRouter = new Hono();

apiRouter.onError(handleError);

apiRouter.use('/*', authMiddleware);

apiRouter.route('/dentist', dentistRouter);

apiRouter.route('/appointment', appointmentRouter);

apiRouter.route('/child', childRouter);

apiRouter.route('/course', courseRouter);

apiRouter.route('/transaction', transactionRouter);

export default apiRouter;
