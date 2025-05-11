import apiRouter from './routes';
import authRouter from './modules/auth/auth.route';
import { Hono } from 'hono';
import { html } from 'hono/html';
import { appCors } from './middleware/cors';

const app = new Hono();

app.use('*', appCors());

app.get('/', (c) => {
	return c.html(
		html`<!doctype html>
			<h1>Smiltheet API</h1>
			<a href="https://apidog.com/apidoc/shared/cafa49bb-327d-4dc3-8e65-aa1eea473073"
				>¡Check our docs for more info!</a
			> `
	);
});

app.route('/auth', authRouter);

app.route('/api', apiRouter);

export default app;
