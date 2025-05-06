import { Hono } from 'hono';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth';

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/sign', (c) => authController.signUp(c));
authRouter.post('/login', (c) => authController.logIn(c));
authRouter.get('/logout', authMiddleware, (c) => authController.logout(c));


export default authRouter;
