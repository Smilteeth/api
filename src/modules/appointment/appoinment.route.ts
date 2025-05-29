import { Hono } from 'hono';
import { AppointmentController } from './appointment.controller';

type Variables = {
	appointmentController: AppointmentController;
  };
  
  const appointmentRouter = new Hono<{ Variables: Variables }>();

appointmentRouter.use('*', async (c, next) => {
	if (!c.var.appointmentController) {
	  c.set('appointmentController', new AppointmentController(c));
	}
	await next();
});

appointmentRouter.put('/', (c) => c.var.appointmentController.create(c));

appointmentRouter.get('/', (c) => c.var.appointmentController.fetchUserAppointments(c));

export default appointmentRouter;
