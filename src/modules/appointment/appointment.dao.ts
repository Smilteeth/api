import { AppointmentTableTypes } from './appointment.types';
import { appointmentTable } from '../../config/db/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';

import * as schema from '../../config/db/schema';

export class AppointmentDao implements DataAccessObject<AppointmentTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(data: Omit<AppointmentTableTypes, 'appointmentId'>): Promise<void> {
		await this.db.insert(appointmentTable).values(data);
	}

	async fetchByUserId(
		id: number
	): Promise<Array<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>> | undefined> {
		return await this.db.query.appointmentTable.findMany({
			where: (model, { eq, or }) => or(eq(model.fatherId, id), eq(model.dentistId, id)),
			columns: {
				creationDate: false,
				lastModificationDate: false
			},
			orderBy: (model, { asc }) => asc(model.appointmentDatetime)
		});
	}

	async fetchById(id: number): Promise<AppointmentTableTypes | undefined> {
		return await this.db.query.appointmentTable.findFirst({
			where: (model, { eq }) => eq(model.appointmentId, id)
		});
	}
}
