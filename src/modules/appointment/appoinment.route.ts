import { Hono } from 'hono';
import { AppointmentController } from './appointment.controller';

const appointmentRouter = new Hono();

const appointmentController = new AppointmentController();

appointmentRouter.put('/', (c) => appointmentController.create(c));
appointmentRouter.get('/', (c) => appointmentController.fetchByUserId(c));

export default appointmentRouter;
