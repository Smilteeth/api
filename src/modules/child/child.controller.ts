import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ChildTableTypes, EditableData } from './child.types';
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

  async edit(c: Context) {
    const data: Partial<EditableData> = await c.req.json();

    await this.childService.edit(data);

    return c.json({ message: 'Successfully edited', updatedFields: Object.keys(data) }, 200);
  }

  async fetchChilds(c: Context) {
    const { page, limit } = c.req.query();

    const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

    const childs = await this.childService.fetchUserChilds(parsedPage, parsedLimit);

    return c.json(childs);
  }

  async fetchChildById(c: Context) {
    const id = c.req.param('id');

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

  async addBrush(c: Context) {
    const { id } = c.req.query();

    if (!id) {
      throw new HTTPException(401, { message: 'Missing child id' });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new HTTPException(401, { message: 'Invalid child id' });
    }

    await this.childService.addBrush(parsedId);

    return c.json({ message: 'Brush added' }, 200);
  }

  async fetchChildBrushes(c: Context) {
    const { id, page, limit } = c.req.query();

    if (!id) {
      throw new HTTPException(401, { message: 'Missing child id' });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new HTTPException(401, { message: 'Invalid child id' });
    }

    const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

    const brushes = await this.childService.getBrushes(parsedId, parsedPage, parsedLimit);

    return c.json(brushes);
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
