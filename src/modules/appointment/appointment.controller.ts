import { Context } from 'hono';
import { AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { HTTPException } from 'hono/http-exception';
import { AppointmentService } from './appointment.service';
import { ChildService } from '../child/child.service';
import { ServiceFactory } from '../../core/service.factory';
import { Pagination } from '../../utils/pagination';
import { DentistService } from '../dentist/dentist.service';

export class AppointmentController {
  private appointmentService: AppointmentService;
  private childService: ChildService;
  private dentistService: DentistService;
  private pagination: Pagination;

  constructor(c: Context) {
    this.appointmentService = new ServiceFactory(c).createService('appointment');
    this.childService = new ServiceFactory(c).createService('child');
    this.dentistService = new ServiceFactory(c).createService('dentist');
    this.pagination = new Pagination();
  }

  async create(c: Context) {
    const data: Omit<AppointmentTableTypes, 'appointmentId'> = await c.req.json();

    if (!this.isValidData(data, 'create')) {
      throw new HTTPException(400, { message: 'Missing attribute' });
    }

    const child = await this.childService.fetchById(data.childId!);

    const dentist = await this.dentistService.fetchById(data.dentistId!);

    this.isWithinServiceHours(data.appointmentDatetime, dentist.serviceStartTime, dentist.serviceEndTime)

    await this.appointmentService.create(data);

    return c.json({ message: `Appointment Scheduled for child named ${child.name}` }, 201);
  }

  async fetchUserAppointments(c: Context) {
    const { page, limit } = c.req.query();

    const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

    const appointments = await this.appointmentService.fetchUserAppointments(parsedPage, parsedLimit);

    if (!appointments) {
      throw new HTTPException(404, { message: "User doesn't have appointments" });
    }

    return c.json(appointments);
  }

  async fetchAppointmentById(c: Context) {
    const id = c.req.param('id');

    if (!id) {
      throw new HTTPException(401, { message: 'Missing appointment id' });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new HTTPException(401, { message: 'Invalid appointment id' });
    }

    const appointment = await this.appointmentService.fetchById(parsedId);

    return c.json(appointment);
  }

  async deactivateAppointment(c: Context) {
    const data = await c.req.json();

    const deactivationType = ['FINISHED', 'CANCELLED', 'RESCHEDULED'];

    if (!this.isValidData(data, 'deactivation')) {
      throw new HTTPException(400, { message: 'Missing attribute' });
    }

    if (!deactivationType.includes(data.type)) {
      throw new HTTPException(400, { message: 'Invalid attribute' });
    }

    await this.appointmentService.deactiveAppointment(data);

    return c.json({ message: 'Appointment deactivated' }, 201);
  }

  private isValidData(
    data: Partial<AppointmentTableTypes | DeactiveAppointmentTableTypes>,
    mode: 'create' | 'deactivation'
  ): boolean {
    const fieldSets = {
      create: ['dentistId', 'childId', 'reason', 'appointmentDatetime'],
      deactivation: ['deactiveAppointmentId', 'reason', 'type']
    };

    const requiredFields = fieldSets[mode] as Array<keyof AppointmentTableTypes | DeactiveAppointmentTableTypes>;
    return requiredFields.every((field) => Boolean(data[field as keyof typeof data]));
  }

  private isWithinServiceHours(
    appointmentDatetime: string,
    serviceStartTime: string,
    serviceEndTime: string
  ) {
    const appointmentTime = new Date(appointmentDatetime);
    const appointmentMinutes = appointmentTime.getHours() * 60 + appointmentTime.getMinutes();

    const [startHour, startMin] = serviceStartTime.split(':').map(Number);
    const [endHour, endMin] = serviceEndTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const isWithin =
      startMinutes < endMinutes
        ? appointmentMinutes >= startMinutes && appointmentMinutes <= endMinutes
        : appointmentMinutes >= startMinutes || appointmentMinutes <= endMinutes;

    if (!isWithin) {
      throw new HTTPException(409, {
        message: "Appointment is not within dentist service hours"
      });
    }
  }
}
