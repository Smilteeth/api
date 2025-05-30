import { cors } from 'hono/cors';

export function appCors() {
	return cors({
		origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
		allowMethods: ['GET', 'PUT', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-CSRF-Token']
	});
}
