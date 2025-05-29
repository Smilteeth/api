import { Hono } from 'hono';
import { DentistController } from './dentist.controller';

type Variables = {
	dentistController: DentistController;
};

const dentistRouter = new Hono<{ Variables: Variables }>();

dentistRouter.use('*', async (c, next) => {
	if (!c.var.dentistController) {
		c.set('dentistController', new DentistController(c));
	}

	await next();
});

dentistRouter.put('/', (c) => c.get('dentistController').create(c));

export default dentistRouter;
