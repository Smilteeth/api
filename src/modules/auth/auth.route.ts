import { Hono } from 'hono';
import { AuthController } from './auth.controller';

type Variables = {
	authController: AuthController;
};

const authRouter = new Hono<{ Variables: Variables }>();

authRouter.use('*', async (c, next) => {
	if (!c.var.authController) {
		c.set('authController', new AuthController(c));
	}
	await next();
});

authRouter.put('/sign', (c) => c.get('authController').signUp(c));
authRouter.put('/login', (c) => c.get('authController').logIn(c));

export default authRouter;
