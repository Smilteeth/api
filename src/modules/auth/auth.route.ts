import { Hono } from 'hono';
import { AuthController } from './auth.controller';

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/sign', (c) => authController.signUp(c));
authRouter.post('/login', (c) => authController.logIn(c));

export default authRouter;
