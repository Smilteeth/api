import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { DentistTableTypes } from './dentist.types';
import { ServiceFactory } from '../../core/service.factory';
import { DentistService } from './dentist.service';
import { Pagination } from '../../utils/pagination';

export class DentistController {
  private dentistService: DentistService;

  private pagination: Pagination;

  constructor(c: Context) {
    this.dentistService = new ServiceFactory(c).createService('dentist');
    this.pagination = new Pagination();
  }

  async create(c: Context) {
    const data: Omit<DentistTableTypes, 'userId'> = await c.req.json();

    if (!this.isValidData(data)) {
      throw new HTTPException(400, { message: 'Missing attribute' });
    }

    await this.dentistService.create(data);

    return c.json({ message: 'Successful registration' }, 201);
  }

  async fetchDentists(c: Context) {
    const { page, limit } = c.req.query();

    const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

    const dentists = await this.dentistService.fetchDentists(parsedPage, parsedLimit);

    return c.json(dentists);
  }

  async fetchDentistById(c: Context) {
    const id = c.req.param('id');

    if (!id) {
      throw new HTTPException(401, { message: 'Missing dentist id' });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new HTTPException(401, { message: 'Invalid dentist id' });
    }

    const dentist = await this.dentistService.fetchById(parsedId);

    return c.json(dentist)
  }

  async isFormFilled(c: Context) {
    const isFilled = await this.dentistService.isFormFilled();

    return c.text(isFilled.toString());
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
