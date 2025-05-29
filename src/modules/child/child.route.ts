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

childRouter.put('/', (c) => c.get('childController').create(c));

export default childRouter;
