import { AppointmentTableTypes, RescheduledAppointmentData } from './appointment.types';
import { appointmentTable } from '../../config/db/schema';
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

	async deleteById(data: { id: number; dateModified: string }): Promise<void> {
		await this.db
			.update(appointmentTable)
			.set({ isActive: false, lastModificationDate: data.dateModified })
			.where(eq(appointmentTable.appointmentId, data.id));
	}

	// operations with rescheduled appointment table
	async addToRescheduled(data: RescheduledAppointmentData) {
		await this.db.insert(schema.rescheduledAppointmentTable).values(data);
	}

	async fetchRescheduledAppointmentById(id: number) {
		return await this.db.query.rescheduledAppointmentTable.findFirst({
			where: (model, { eq }) => eq(model.appointmentId, id)
		});
	}

	async fetchUserRescheduledAppointments(id: number): Promise<Array<RescheduledAppointmentData>> {
		return await this.db
			.select()
			.from(schema.rescheduledAppointmentTable)
			.where(
				and(
					eq(appointmentTable.fatherId, id),
					eq(appointmentTable.appointmentId, schema.rescheduledAppointmentTable.appointmentId)
				)
			);
	}
}
