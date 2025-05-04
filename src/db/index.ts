import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export interface Env {
	DB: D1Database;
}

export const db = (env: Env) => {
	return drizzle(env.DB, { schema });
};
