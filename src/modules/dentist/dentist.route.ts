import { Hono } from 'hono';
import { DentistController } from './dentist.controller';

const dentistRouter = new Hono();

const dentistController = new DentistController();

dentistRouter.post('/', (c) => dentistController.create(c));

export default dentistRouter;
