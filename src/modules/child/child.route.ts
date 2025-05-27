import { Hono } from 'hono';
import { ChildController } from './child.controller';

const childRouter = new Hono();

const childController = new ChildController();

childRouter.put('/', (c) => childController.create(c));

export default childRouter;
