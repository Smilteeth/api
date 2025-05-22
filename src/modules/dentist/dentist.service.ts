import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { DentistDao } from './dentist.dao';
import { DentistTableTypes } from './dentist.types';

export class DentistService {
	private dentistDao: DentistDao;
	private jwtPayload: JwtPayload;

	constructor(dao: DentistDao, jwtPayload: JwtPayload) {
		this.dentistDao = dao;
		this.jwtPayload = jwtPayload;
	}

	async create(data: Omit<DentistTableTypes, 'userId'>) {
		if (this.jwtPayload.type !== 'DENTIST') {
			throw new HTTPException(403, { message: 'User is not a dentist' });
		}

		await this.dentistDao.create({
			userId: this.jwtPayload.userId,
			...data
		});
	}
}
