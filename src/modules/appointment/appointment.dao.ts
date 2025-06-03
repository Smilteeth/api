import { AppointmentData, AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { appointmentTable, deactiveAppointmentTable, childTable, dentistTable, userTable } from '../../config/db/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';

import * as schema from '../../config/db/schema';
import { and, eq, getTableColumns, or, sql } from 'drizzle-orm';

export class AppointmentDao implements DataAccessObject<AppointmentTableTypes | AppointmentData> {
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
    const allAppointmentTables = getTableColumns(appointmentTable);

    const {

      lastModificationDate,
      ...returnedAppointmentData
    } = allAppointmentTables;


    return await this.db
      .select({
        ...returnedAppointmentData,
        child: sql<string>`concat(${childTable.name}, " ", ${childTable.lastName})`.as('child'),
        dentist: sql<string>`concat("Dr.", " ", ${userTable.name}, " ", ${userTable.lastName})`.as('dentist')
      })
      .from(appointmentTable)
      .innerJoin(childTable, eq(childTable.childId, appointmentTable.childId))
      .leftJoin(dentistTable, eq(childTable.dentistId, dentistTable.userId))
      .leftJoin(userTable, eq(dentistTable.userId, userTable.userId))
      .where(or(eq(appointmentTable.fatherId, id), eq(appointmentTable.dentistId, id)));

  }

  async fetchById(id: number, userId: number): Promise<AppointmentData | undefined> {
    const allAppointmentTables = getTableColumns(appointmentTable);

    const {
      lastModificationDate,
      ...returnedAppointmentData
    } = allAppointmentTables;

    const appointment = await this.db
      .select({
        ...returnedAppointmentData,
        child: sql<string>`concat(${childTable.name}, " ", ${childTable.lastName})`.as('child'),
        dentist: sql<string>`concat("Dr.", " ", ${userTable.name}, " ", ${userTable.lastName})`.as('dentist')
      })
      .from(appointmentTable)
      .innerJoin(childTable, eq(childTable.childId, appointmentTable.childId))
      .leftJoin(dentistTable, eq(childTable.dentistId, dentistTable.userId))
      .leftJoin(userTable, eq(dentistTable.userId, userTable.userId))
      .where(and(eq(appointmentTable.appointmentId, id), or(eq(childTable.fatherId, userId), eq(childTable.dentistId, userId))))
      .limit(1);

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

}
