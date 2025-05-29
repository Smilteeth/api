import { AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { appointmentTable, deactiveAppointmentTable } from '../../config/db/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';

import * as schema from '../../config/db/schema';
import { and, eq } from 'drizzle-orm';

export class AppointmentDao implements DataAccessObject<AppointmentTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(
		data: Omit<AppointmentTableTypes, 'appointmentId' | 'creationDate' | 'lastModificationDate' | 'isActive'>
	): Promise<void> {
		await this.db.insert(appointmentTable).values(data);
	}

	async fetchUserAppointments(
		id: number
	): Promise<Array<Omit<AppointmentTableTypes, 'lastModificationDate'>> | undefined> {
		return await this.db.query.appointmentTable.findMany({
			where: (model, { eq, or }) => and(or(eq(model.fatherId, id), eq(model.dentistId, id)), eq(model.isActive, true)),
			columns: {
				lastModificationDate: false
			},
			orderBy: (model, { asc }) => asc(model.appointmentDatetime)
		});
	}

	async fetchById(id: number): Promise<AppointmentTableTypes | undefined> {
		return await this.db.query.appointmentTable.findFirst({
			where: (model, { eq }) => and(eq(model.appointmentId, id), eq(model.isActive, true))
		});
	}

	// operations with inactive appointment
	async deactivateAppointment(data: Omit<DeactiveAppointmentTableTypes, 'deactivationDate'>) {
		await this.db.transaction(async (tx) => {
			await tx
				.update(appointmentTable)
				.set({ isActive: false })
				.where(
					and(eq(appointmentTable.appointmentId, data.deactiveAppointmentId), eq(appointmentTable.isActive, true))
				);

			await tx.insert(deactiveAppointmentTable).values(data);
		});
	}

	async fetchDeactiveAppointmentById(id: number) {
		return await this.db
			.select()
			.from(deactiveAppointmentTable)
			.where(
				and(
					eq(appointmentTable.fatherId, id),
					eq(appointmentTable.appointmentId, deactiveAppointmentTable.deactiveAppointmentId)
				)
			);
	}
}
