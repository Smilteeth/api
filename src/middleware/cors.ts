import { cors } from 'hono/cors';

export function appCors() {
	cors({
		origin: ['http://localhost:5173'],
		allowMethods: ['PUT', 'GET']
	});
}
