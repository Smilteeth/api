import { Context } from 'hono';
import { getDb } from '../config/db';
import { AuthDao } from '../modules/auth/auth.dao';
import { DentistDao } from '../modules/dentist/dentist.dao';
import { AppointmentDao } from '../modules/appointment/appointment.dao';

type DaoType = 'auth' | 'dentist' | 'appointment';

interface DaoMap {
	auth: AuthDao;
	dentist: DentistDao;
	appointment: AppointmentDao;
}

export class DaoFactory {
	private daoCreator: {
		[key in DaoType]: () => DaoMap[key];
	}

	constructor(context: Context) {
		const db = getDb(context.env);

		this.daoCreator = {
			auth: () => new AuthDao(db),
			dentist: () => new DentistDao(db),
			appointment: () => new AppointmentDao(db),
		}
	}

	createDao<T extends DaoType>(type: T): DaoMap[T] {
		const dao = this.daoCreator[type];

		if (!dao) {
			throw new Error("Invalid type");
		}

		return dao();
	}
}