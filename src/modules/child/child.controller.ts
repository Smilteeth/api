import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ChildTableTypes } from './child.types';
import { ServiceFactory } from '../../core/service.factory';

export class ChildController {
	async create(c: Context) {
		try {
			const data = await c.req.json();

			if (!this.isValidData(data)) {
				throw new HTTPException(400, { message: 'Missing attribute' });
			}

			const gender = data.gender.toUpperCase();

			if (gender !== 'M' && gender !== 'F') {
				throw new HTTPException(400, { message: '' });
			}

			const childService = new ServiceFactory(c).createService('child');

			await childService.create(data);

			return c.json({ message: 'Child added' }, 201);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);

			if (error instanceof HTTPException) {
				throw error;
			}

			throw new HTTPException(500, {
				message: 'Server error',
				cause: errorMessage
			});
		}
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
