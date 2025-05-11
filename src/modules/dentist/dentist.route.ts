import { Hono } from 'hono';
import { DentistController } from './dentist.controller';

const dentistRouter = new Hono();

const dentistController = new DentistController();

dentistRouter.put('/', (c) => dentistController.create(c));

export default dentistRouter;
