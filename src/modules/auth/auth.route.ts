import { Hono } from 'hono';
import { AuthController } from './auth.controller';

const authRouter = new Hono();
const authController = new AuthController();

authRouter.put('/sign', (c) => authController.signUp(c));
authRouter.put('/login', (c) => authController.logIn(c));

export default authRouter;
