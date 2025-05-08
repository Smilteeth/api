import { Context } from 'hono';
import { getDb } from '../config/db';
import { AuthDao } from '../modules/auth/auth.dao';
import { DentistDao } from '../modules/dentist/dentist.dao';

export class DaoFactory {
	private context: Context;

	constructor(c: Context) {
		this.context = c;
	}

	createDao(type: String) {
		const db = getDb(this.context.env);

		switch (type) {
			case 'auth':
				return new AuthDao(db);
			case 'dentist':
				return new DentistDao(db);
			default:
				throw new Error('Invalid type');
		}
	}
}
