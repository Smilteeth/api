import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { ChildDao } from './child.dao';
import { BrushType, ChildData, ChildReturnType, ChildTableTypes, EditableData, EditableField } from './child.types';
import { Pagination, PaginationType } from '../../utils/pagination';
import { DateValidator } from '../../utils/DateValidator';
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js';

export class ChildService {
  private childDao: ChildDao;
  private jwtPayload: JwtPayload;
  private pagination: Pagination;
  private editableKeys = [
    "childId",
    'name',
    'lastName',
    'gender',
    'birthDate',
    'morningBrushingTime',
    'afternoonBrushingTime',
    'nightBrushingTime'
  ] as const;
  constructor(childDao: ChildDao, jwtPayload: JwtPayload) {
    this.childDao = childDao;
    this.jwtPayload = jwtPayload;
    this.pagination = new Pagination();
  }

  async create(data: ChildData) {
    await this.childDao.create({
      ...data, fatherId: this.jwtPayload.userId,
    });
  }

  async edit(data: Partial<EditableData>) {
    if (!data) {
      throw new HTTPException(409, { message: "Data no provided" });
    }

    if (!data.childId) {
      throw new HTTPException(409, {
        message: "No child id provided"
      });

    }

    if (this.jwtPayload.type === "DENTIST") {
      throw new HTTPException(401, { message: "User can't edit child" });
    }

    this.validateKeys(data);

    await this.fetchById(data.childId);

    await this.childDao.edit({ ...data, lastModificationDate: new DateValidator().getCurrentDate().toISOString() },
      this.jwtPayload.userId,
      data.childId);
  }

  async fetchUserChilds(
    page: number,
    limit: number
  ): Promise<PaginationType<ChildReturnType>> {
    const childs = await this.childDao.fetchUserChilds(this.jwtPayload.userId);

    if (!childs) {
      throw new HTTPException(404, { message: 'Childs not found' });
    }
    return this.pagination.generate<ChildReturnType>(childs, page, limit);
  }

  async fetchById(childId: number): Promise<Omit<ChildTableTypes, 'lastModificationDate'>> {
    const child = await this.childDao.fetchById(childId, this.jwtPayload.userId);

    if (!child) {
      throw new HTTPException(404, { message: 'Child not found' });
    }

    if (child.fatherId !== this.jwtPayload.userId) {
      throw new HTTPException(401, { message: "Child doesn't below to user" });
    }

    return child;
  }

  async addBrush(childId: number) {
    await this.fetchById(childId);

    await this.childDao.addBrush(childId);
  }

  async getBrushes(childId: number, page: number, limit: number): Promise<PaginationType<BrushType>> {
    await this.fetchById(childId);

    const brushes = await this.childDao.getChildBrushes(childId);

    if (!brushes) {
      throw new HTTPException(404, { message: 'Brushes not found' });
    }

    return this.pagination.generate(brushes, page, limit);
  };

  private validateKeys(data: Partial<EditableData>) {
    const keys = Object.keys(data);
    const editableKeySet = new Set(this.editableKeys);

    if (keys.length === 0) {
      throw new HTTPException(409, {
        message: "No fields provied"
      });
    }

    if (keys.some(key => !editableKeySet.has(key as EditableField))) {
      throw new HTTPException(409, { message: "Invalid field provided" });
    }

    if ('gender' in data && data.gender !== 'M' && data.gender !== 'F') {
      throw new HTTPException(409, { message: "Gender must be either 'M' or 'F'" });
    }
  }
}
