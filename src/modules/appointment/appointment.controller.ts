import { Context } from 'hono';
import { AppointmentTableTypes, DeactiveAppointmentTableTypes } from './appointment.types';
import { HTTPException } from 'hono/http-exception';
import { AppointmentService } from './appointment.service';
import { ChildService } from '../child/child.service';
import { ServiceFactory } from '../../core/service.factory';

export class AppointmentController {
	private appointmentService: AppointmentService;
	private childService: ChildService;

	constructor(c: Context) {
		this.appointmentService = new ServiceFactory(c).createService('appointment');
		this.childService = new ServiceFactory(c).createService('child');
	}

	async create(c: Context) {
		const data: Omit<AppointmentTableTypes, 'appointmentId'> = await c.req.json();

		if (!this.isValidData(data, 'create')) {
			throw new HTTPException(400, { message: 'Missing attribute' });
		}

		const child = await this.childService.fetchById(data.childId!);
		await this.appointmentService.create(data);

		return c.json({ message: `Appointment Scheduled for child named ${child.name}` }, 201);
	}

	async fetchUserAppointments(c: Context) {
		const { page, limit } = await c.req.query();

		const { parsedPage, parsedLimit } = this.getPaginationValues(page, limit);

		const appointments = await this.appointmentService.fetchUserAppointments(parsedPage, parsedLimit);

		if (!appointments) {
			throw new HTTPException(404, { message: "User doesn't have appointments" });
		}

		return c.json(appointments);
	}

	async fetchAppointmentById(c: Context) {
		const id = await c.req.param('id');

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

	private getPaginationValues(page: string, limit: string) {
		const parsedPage = parseInt(page);
		const parsedLimit = parseInt(limit);

		return {
			parsedPage: isNaN(parsedPage) ? 1 : parsedPage,
			parsedLimit: isNaN(parsedLimit) ? 10 : parsedLimit
		};
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
}
