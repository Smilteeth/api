import { Hono } from 'hono';

const app = new Hono().basePath('/api');

app.get('/', (c) => {
	return c.json({
		message: 'Bienvenido a la API de smiltheet'
	});
});

app.get('/greet', (c) => {
	const name = c.req.query('name') || 'Mundo';
	return c.json({
		message: `Hola, ${name}!`
	});
});

export default app;
