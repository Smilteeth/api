import { HTTPException } from 'hono/http-exception';
import { JwtPayload } from '../../types/payload.type';
import { DentistDao } from './dentist.dao';
import { DentistTableTypes, EditableData, EditableField } from './dentist.types';
import { Pagination, PaginationType } from '../../utils/pagination';
import { UserTableTypes } from '../auth/auth.types';

export class DentistService {
  private dentistDao: DentistDao;
  private jwtPayload: JwtPayload;
  private pagination: Pagination;

  constructor(dao: DentistDao, jwtPayload: JwtPayload) {
    this.dentistDao = dao;
    this.jwtPayload = jwtPayload;
    this.pagination = new Pagination();
  }

  async create(data: Omit<DentistTableTypes, 'userId'>) {
    if (this.jwtPayload.type !== 'DENTIST') {
      throw new HTTPException(403, { message: 'User is not a dentist' });
    }

    await this.dentistDao.create({
      userId: this.jwtPayload.userId,
      ...data
    });
  }

  async edit(data: Partial<EditableData>) {
    const editableKeys = [
      'university',
      'speciality',
      'about',
      'serviceStartTime',
      'serviceEndTime',
      'phoneNumber',
      'latitude',
      'longitude',
    ] as const;

    if (!data) {
      throw new HTTPException(409, { message: "Data no provided" });
    }

    if (this.jwtPayload.type === "FATHER") {
      throw new HTTPException(401, { message: "User can't edit dentist" });
    }

    const keys = Object.keys(data);
    const editableKeySet = new Set(editableKeys);

    if (keys.length === 0) {
      throw new HTTPException(409, {
        message: "No fields provied"
      });
    }

    if (keys.some(key => !editableKeySet.has(key as EditableField))) {
      throw new HTTPException(409, { message: "Invalid field provided" });
    }

    await this.dentistDao.edit(data, this.jwtPayload.userId);
  }

  async fetchDentists(
    page: number,
    limit: number
  ): Promise<
    PaginationType<
      Omit<DentistTableTypes, 'university' | 'about'> &
      Omit<
        UserTableTypes,
        'birthDate' | 'password' | 'creationDate' | 'lastModificationDate' | 'isActive' | 'type' | 'email'
      >
    >
  > {
    const dentists = await this.dentistDao.fetchDentists();

    if (!dentists) {
      throw new HTTPException(404, { message: 'Dentists not found' });
    }

    return this.pagination.generate<
      Omit<DentistTableTypes, 'university' | 'about'> &
      Omit<
        UserTableTypes,
        'birthDate' | 'password' | 'creationDate' | 'lastModificationDate' | 'isActive' | 'type' | 'email'
      >
    >(dentists, page, limit);
  }

  async fetchById(
    dentistId: number
  ): Promise<
    Omit<
      DentistTableTypes &
      Omit<UserTableTypes, 'birthDate' | 'password' | 'creationDate' | 'lastModificationDate' | 'isActive' | 'type'>,
      'lastModificationDate'
    >
  > {
    const dentist = await this.dentistDao.fetchById(dentistId);

    if (!dentist) {
      throw new HTTPException(404, { message: 'Dentist not found' });
    }

    return dentist;
  }

  async isFormFilled(): Promise<boolean> {
    if (this.jwtPayload.type === "FATHER") {
      throw new HTTPException(401, { message: "Father doen't need to fill a form" });
    }

    try {
      await this.fetchById(this.jwtPayload.userId);
      return true;
    } catch (e) {
      return false;
    }
  }
}
