import { HTTPException } from 'hono/http-exception';
import { AppointmentTableTypes } from '../modules/appointment/appointment.types';

enum DateStatus {
	Past = 'past',
	Future = 'future',
	Present = 'present'
}

export class DateValidator {
	userIsAvailable(
		appointments: Array<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>> | undefined,
		appointmentDatetime: string
	) {
		if (!appointments) {
			return;
		}

		if (appointments.some((appointment) => appointment.appointmentDatetime === appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Datetime occupied' });
		}
	}

	validFormat(appointmentDatetime: string) {
		const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{3})?$/;

		if (!dateRegex.test(appointmentDatetime)) {
			throw new HTTPException(409, { message: 'Invalid datetime format' });
		}

		const appointmentDate = new Date(appointmentDatetime);

		if (isNaN(appointmentDate.getTime())) {
			throw new HTTPException(409, { message: 'Invalid datetime format' });
		}

		const parts = appointmentDatetime.split(/[- :]/).map(Number);
		const [year, month, day, hour, minute, second] = parts;

		if (
			appointmentDate.getFullYear() !== year ||
			appointmentDate.getMonth() !== month - 1 ||
			appointmentDate.getDate() !== day
		) {
			throw new HTTPException(409, { message: 'Invalid datetime format' });
		}

		if (
			appointmentDate.getHours() !== hour ||
			appointmentDate.getMinutes() !== minute ||
			appointmentDate.getSeconds() !== second
		) {
			throw new HTTPException(409, { message: 'Invalid datetime format' });
		}
	}

	isAppointmentDate(appointmentDatetime: string): DateStatus {
		const appointmentDate = this.getAppointmentDate(appointmentDatetime);
		const currentDate = this.getCurrentDate();

		if (appointmentDate.getTime() > currentDate.getTime()) {
			return DateStatus.Future;
		} else if (appointmentDate.getTime() < currentDate.getTime()) {
			return DateStatus.Past;
		} else {
			return DateStatus.Present;
		}
	}

	appointmentCanBeInactivated(creationDate: string) {
		const appointmentDate = this.getAppointmentDate(creationDate);

		const currentDate = this.getCurrentDate();

		const differenceInMs = appointmentDate.getTime() - currentDate.getTime();

		const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

		// true if is less than 24 hrs
		return twentyFourHoursInMs > differenceInMs;
	}

	private getAppointmentDate(appointmentDatetime: string) {
		const appointmentDate = new Date(appointmentDatetime);

		if (isNaN(appointmentDate.getTime())) {
			throw new HTTPException(409, { message: 'Invalid datetime' });
		}

		return appointmentDate;
	}

	private getCurrentDate() {
		return new Date();
	}
}
