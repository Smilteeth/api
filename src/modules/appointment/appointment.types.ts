import { dbTypes } from '../../config/db/types';

export type AppointmentTableTypes = dbTypes['AppointmentTable'];

export type RescheduledAppointmentData = {
	appointmentId: number;
	rescheduleReason: string;
	rescheduledDate: string;
};

export type CancelledAppointmentData = {
	appointmentId: number;
	cancellationReason: string;
	dateCancelled: string;
};
