import { Context } from 'hono';
import { AuthService } from '../modules/auth/auth.service';
import { DentistService } from '../modules/dentist/dentist.service';
import { DaoFactory } from './dao.factory';
import { DentistDao } from '../modules/dentist/dentist.dao';
import { AuthDao } from '../modules/auth/auth.dao';

export class ServiceFactory {
	private context: Context;

	constructor(c: Context) {
		this.context = c;
	}

	createService(type: String) {
		switch (type) {
			case 'auth':
				const authDao = new DaoFactory(this.context).createDao('auth');
				return new AuthService(authDao as AuthDao, this.context.env.JWT_SECRET);

			case 'dentist':
				const dentistDao = new DaoFactory(this.context).createDao('dentist');
				return new DentistService(dentistDao as DentistDao, this.context.get('jwtPayload'));

			default:
				throw new Error('Invalid type');
		}
	}
}
