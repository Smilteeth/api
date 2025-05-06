import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt } from 'hono/jwt';
import { Validator } from '../utils/validator';

export function authMiddleware(c: Context, next: Next) {
	const secret = c.env.JWT_SECRET;

	if (!secret) {
		throw Error('Secret not found');
	}

	new Validator().validateAuthHeaders(c);

	return jwt({
		secret: secret
	})(c, next);
}
