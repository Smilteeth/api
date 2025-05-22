import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { DentistTableTypes } from './dentist.types';
import { ServiceFactory } from '../../core/service.factory';

export class DentistController {
	async create(c: Context) {
		try {
			const data: Omit<DentistTableTypes, 'userId'> = await c.req.json();

			if (!this.isValidData(data)) {
				throw new HTTPException(400, { message: 'Missing attribute' });
			}

			const dentistService = new ServiceFactory(c).createService('dentist');

			await dentistService.create(data);

			return c.json({ message: 'Successful registration' }, 201);
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

	private isValidData(data: Partial<DentistTableTypes>): boolean {
		const requiredFields: Array<keyof DentistTableTypes> = [
			'professionalLicense',
			'serviceStartTime',
			'serviceEndTime',
			'phoneNumber',
			'latitude',
			'longitude'
		];

		return requiredFields.every((field) => Boolean(data[field]));
	}
}
