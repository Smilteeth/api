import { HTTPException } from 'hono/http-exception';
import { AppointmentTableTypes } from '../modules/appointment/appointment.types';

export enum DateStatus {
  Past = 'past',
  Future = 'future',
  Present = 'present'
}

export class DateValidator {
  userIsAvailable(
    appointments: Array<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>> | undefined,
    appointmentDatetime: string
  ): boolean {
    if (!appointments) {
      return true;
    }

    if (appointments.some((appointment) => (appointment.appointmentDatetime === appointmentDatetime && appointment.isActive))) {
      return false;
    }

    return true
  }

  validFormat(appointmentDatetime: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{3})?$/;

    if (!dateRegex.test(appointmentDatetime)) {
      return false;
    }

    const appointmentDate = new Date(appointmentDatetime);

    if (isNaN(appointmentDate.getTime())) {
      return false;
    }

    const parts = appointmentDatetime.split(/[- :]/).map(Number);
    const [year, month, day, hour, minute, second] = parts;

    if (
      appointmentDate.getFullYear() !== year ||
      appointmentDate.getMonth() !== month - 1 ||
      appointmentDate.getDate() !== day
    ) {
      return false;
    }

    if (
      appointmentDate.getHours() !== hour ||
      appointmentDate.getMinutes() !== minute ||
      appointmentDate.getSeconds() !== second
    ) {
      return false;
    }

    return true;
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

  appointmentCanBeInactivated(creationDate: string): boolean {
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
