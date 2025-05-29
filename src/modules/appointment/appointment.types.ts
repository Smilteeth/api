import { dbTypes } from '../../config/db/types';

export type AppointmentTableTypes = dbTypes['AppointmentTable'];
export type DeactiveAppointmentTableTypes = dbTypes['DeactiveAppointmentTable'];

export type AppointmentData = AppointmentTableTypes & {
	childName: string;
	childLastname: string;
};
