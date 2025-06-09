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

dentistRouter.put('/edit', (c) => c.var.dentistController.edit(c));
dentistRouter.put('/', (c) => c.var.dentistController.create(c));

dentistRouter.get('/is-form-filled', (c) => c.var.dentistController.isFormFilled(c));
dentistRouter.get('/:id', (c) => c.var.dentistController.fetchDentistById(c));
dentistRouter.get('/', (c) => c.var.dentistController.fetchDentists(c));

export default dentistRouter;
