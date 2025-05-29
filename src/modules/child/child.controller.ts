import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ChildTableTypes } from './child.types';
import { ChildService } from './child.service';
import { ServiceFactory } from '../../core/service.factory';

export class ChildController {
	private childService: ChildService;

	constructor(c: Context) {
		this.childService = new ServiceFactory(c).createService('child');
	}

	async create(c: Context) {
		const data = await c.req.json();

		if (!this.isValidData(data)) {
			throw new HTTPException(400, { message: 'Missing attribute' });
		}

		const gender = data.gender.toUpperCase();

		if (gender !== 'M' && gender !== 'F') {
			throw new HTTPException(400, { message: '' });
		}

		await this.childService.create(data);

		return c.json({ message: 'Child added' }, 201);
	}

	private isValidData(data: Partial<ChildTableTypes>) {
		const requiredFields: Array<keyof ChildTableTypes> = [
			'name',
			'lastName',
			'gender',
			'birthDate',
			'morningBrushingTime',
			'afternoonBrushingTime',
			'nightBrushingTime'
		];

		return requiredFields.every((field) => Boolean(data[field]));
	}
}
