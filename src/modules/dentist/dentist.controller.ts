import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { DentistTableTypes } from './dentist.types';
import { ServiceFactory } from '../../core/service.factory';
import { DentistService } from './dentist.service';

export class DentistController {
	private dentistService: DentistService;

	constructor(c: Context) {
		this.dentistService = new ServiceFactory(c).createService('dentist');
	}

	async create(c: Context) {
		const data: Omit<DentistTableTypes, 'userId'> = await c.req.json();

		if (!this.isValidData(data)) {
			throw new HTTPException(400, { message: 'Missing attribute' });
		}

		await this.dentistService.create(data);

		return c.json({ message: 'Successful registration' }, 201);
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
