import { Context } from 'hono';
import { AppointmentTableTypes } from './appointment.types';
import { HTTPException } from 'hono/http-exception';
import { ServiceFactory } from '../../core/service.factory';
import { pagination } from '../../utils/pagination';

export class AppointmentController {
	async create(c: Context) {
		try {
			const data: Omit<AppointmentTableTypes, 'appointmentId'> = await c.req.json();

			if (!this.isValidData(data)) {
				throw new HTTPException(400, { message: 'Missing attribute' });
			}

			const appointmentService = new ServiceFactory(c).createService('appointment');

			await appointmentService.create(data);

			return c.json({ message: 'Appointment Scheduled' }, 201);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);

			if (error instanceof HTTPException) {
				throw error;
			}

			if (errorMessage.includes('UNIQUE constraint')) {
				throw new HTTPException(400, {
					message: 'Dentist already registered',
					cause: error
				});
			}

			throw new HTTPException(500, {
				message: 'Server error',
				cause: errorMessage
			});
		}
	}

	async fetchByUserId(c: Context) {
		try {
			const { page, limit } = await c.req.query();

			let parsedPage = parseInt(page);
			let parsedLimit = parseInt(limit);

			parsedPage ??= 1;
			parsedLimit ??= 10;

			const appointmentService = new ServiceFactory(c).createService('appointment');

			const appointments = await appointmentService.fetchByUserId();

			if (!appointments) {
				throw new HTTPException(404, { message: "User doesn't have appointments" });
			}

			return c.json(
				pagination<Omit<AppointmentTableTypes, 'creationDate' | 'lastModificationDate'>>(
					appointments,
					parsedPage,
					parsedLimit
				)
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);

			if (error instanceof HTTPException) {
				throw error;
			}

			console.log(errorMessage);

			throw new HTTPException(500, {
				message: 'Server error',
				cause: errorMessage
			});
		}
	}

	private isValidData(data: Partial<AppointmentTableTypes>): boolean {
		const requiredFields: Array<keyof AppointmentTableTypes> = [
			'dentistId',
			'childId',
			'reason',
			'appointmentDatetime'
		];
		return requiredFields.every((field) => Boolean(data[field]));
	}
}
