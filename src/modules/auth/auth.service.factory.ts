import { AuthDao } from './auth.dao';
import { AuthService } from './auth.service';
import { Context } from 'hono';
import { getDb } from '../../config/db';

export function authServiceFactory(c: Context): AuthService {
	const db = getDb(c.env);

	const authDao = new AuthDao(db);

	return new AuthService(authDao, c.env.JWT_SECRET);
}
