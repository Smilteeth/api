import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';
import { DentistTableTypes } from './dentist.types';

import * as schema from '../../config/db/schema';
import { dentistTable, userTable } from '../../config/db/schema';
import { UserTableTypes } from '../auth/auth.types';
import { eq } from 'drizzle-orm';

export class DentistDao implements DataAccessObject<DentistTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(data: DentistTableTypes): Promise<void> {
		await this.db.insert(dentistTable).values(data);
	}

	async fetchDentists(): Promise<
		| Array<
				Omit<DentistTableTypes, 'university' | 'about'> &
					Omit<
						UserTableTypes,
						'birthDate' | 'password' | 'creationDate' | 'lastModificationDate' | 'isActive' | 'type' | 'email'
					>
		  >
		| undefined
	> {
		const dentists = await this.db
			.select({
				userId: dentistTable.userId,
				name: userTable.name,
				lastName: userTable.lastName,
				professionalLicense: dentistTable.professionalLicense,
				speciality: dentistTable.speciality,
				serviceStartTime: dentistTable.serviceStartTime,
				serviceEndTime: dentistTable.serviceEndTime,
				phoneNumber: dentistTable.phoneNumber,
				latitude: dentistTable.latitude,
				longitude: dentistTable.longitude
			})
			.from(dentistTable)
			.innerJoin(userTable, eq(dentistTable.userId, userTable.userId));

		return dentists;
	}

	async fetchById(
		id: number
	): Promise<
		| (DentistTableTypes &
				Omit<UserTableTypes, 'birthDate' | 'password' | 'creationDate' | 'lastModificationDate' | 'isActive' | 'type'>)
		| undefined
	> {
		const dentist = await this.db
			.select({
				userId: dentistTable.userId,
				name: userTable.name,
				lastName: userTable.lastName,
				email: userTable.email,
				professionalLicense: dentistTable.professionalLicense,
				university: dentistTable.university,
				speciality: dentistTable.speciality,
				about: dentistTable.about,
				serviceStartTime: dentistTable.serviceStartTime,
				serviceEndTime: dentistTable.serviceEndTime,
				phoneNumber: dentistTable.phoneNumber,
				latitude: dentistTable.latitude,
				longitude: dentistTable.longitude
			})
			.from(dentistTable)
			.innerJoin(userTable, eq(dentistTable.userId, userTable.userId))
			.where(eq(dentistTable.userId, id));

		return dentist[0];
	}
}
