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

dentistRouter.put('/', (c) => c.var.dentistController.create(c));
dentistRouter.get('/', (c) => c.var.dentistController.fetchDentists(c));
dentistRouter.get('/:id', (c) => c.var.dentistController.fetchDentistById(c));

export default dentistRouter;
