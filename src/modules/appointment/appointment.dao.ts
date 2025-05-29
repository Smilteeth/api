import { AppointmentData, AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { appointmentTable, deactiveAppointmentTable, childTable } from '../../config/db/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';

import * as schema from '../../config/db/schema';
import { and, eq, getTableColumns, or } from 'drizzle-orm';

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

	async fetchUserAppointments(id: number): Promise<Array<AppointmentData> | undefined> {
		return await this.appointmentQuery(id);
	}

	async fetchById(id: number): Promise<AppointmentData | undefined> {
		const appointment = await this.appointmentQuery(id);

		return appointment[0];
	}

	// operations with inactive appointment
	async deactivateAppointment(data: Omit<DeactiveAppointmentTableTypes, 'deactivationDate'>) {
		await this.db.batch([
			this.db
				.update(appointmentTable)
				.set({ isActive: false })
				.where(
					and(eq(appointmentTable.appointmentId, data.deactiveAppointmentId), eq(appointmentTable.isActive, true))
				),

			this.db.insert(deactiveAppointmentTable).values(data)
		]);
	}

	async fetchUserDeactiveAppointments(id: number): Promise<Array<DeactiveAppointmentTableTypes> | undefined> {
		return await this.db
			.select()
			.from(deactiveAppointmentTable)
			.where(
				and(
					or(eq(appointmentTable.fatherId, id), eq(appointmentTable.dentistId, id)),
					eq(appointmentTable.appointmentId, deactiveAppointmentTable.deactiveAppointmentId)
				)
			);
	}

	private async appointmentQuery(id: number): Promise<Array<AppointmentData> | undefined> {
		return await this.db
			.select({
				...getTableColumns(appointmentTable),
				childName: childTable.name,
				childLastname: childTable.lastName
			})
			.from(appointmentTable)
			.innerJoin(childTable, eq(childTable.childId, appointmentTable.childId))
			.where(or(eq(appointmentTable.fatherId, id), eq(appointmentTable.dentistId, id)));
	}
}
