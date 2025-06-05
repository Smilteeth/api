import { Hono } from 'hono';
import { ChildController } from './child.controller';

type Variables = {
  childController: ChildController;
};

const childRouter = new Hono<{ Variables: Variables }>();

childRouter.use('*', async (c, next) => {
  if (!c.var.childController) {
    c.set('childController', new ChildController(c));
  }

  await next();
});

childRouter.put('/brush', (c) => c.var.childController.addBrush(c));
childRouter.get('/brush', (c) => c.var.childController.fetchChildBrushes(c));
childRouter.put('/edit', (c) => c.var.childController.edit(c));
childRouter.put('/', (c) => c.var.childController.create(c));
childRouter.get('/', (c) => c.var.childController.fetchChilds(c));
childRouter.get('/:id', (c) => c.var.childController.fetchChildById(c));

export default childRouter;
