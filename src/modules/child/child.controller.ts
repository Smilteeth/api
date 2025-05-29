import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ChildTableTypes } from './child.types';
import { ChildService } from './child.service';
import { ServiceFactory } from '../../core/service.factory';
import { Pagination } from '../../utils/pagination';

export class ChildController {
	private childService: ChildService;
	private pagination: Pagination;

	constructor(c: Context) {
		this.childService = new ServiceFactory(c).createService('child');
		this.pagination = new Pagination();
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

	async fetchChilds(c: Context) {
		const { page, limit } = await c.req.query();

		const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

		const childs = await this.childService.fetchUserChilds(parsedPage, parsedLimit);

		return c.json(childs);
	}

	async fetchChildById(c: Context) {
		const id = await c.req.param('id');

		if (!id) {
			throw new HTTPException(401, { message: 'Missing child id' });
		}

		const parsedId = parseInt(id);

		if (isNaN(parsedId)) {
			throw new HTTPException(401, { message: 'Invalid child id' });
		}

		const child = await this.childService.fetchById(parsedId);

		return c.json(child);
	}

	private isValidData(data: Partial<ChildTableTypes>) {
		const requiredFields: Array<keyof ChildTableTypes> = [
			'name',
			'lastName',
			'dentistId',
			'gender',
			'birthDate',
			'morningBrushingTime',
			'afternoonBrushingTime',
			'nightBrushingTime'
		];

		return requiredFields.every((field) => Boolean(data[field]));
	}
}
