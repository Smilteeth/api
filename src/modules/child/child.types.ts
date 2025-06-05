import { SQL } from 'drizzle-orm';
import { dbTypes } from '../../config/db/types';

export type ChildTableTypes = dbTypes['ChildTable'];

export type ChildData = {
  name: string;
  lastName: string;
  dentistId: number;
  gender: 'M' | 'F';
  birthDate: string;
  morningBrushingTime: string;
  afternoonBrushingTime: string;
  nightBrushingTime: string;
  fatherId?: number;
};

export type ChildReturnType = Omit<ChildTableTypes, 'lastModificationDate'> & { father: string; dentist: string; };



export type EditableField = 'name'
  | 'lastName'
  | 'gender'
  | 'birthDate'
  | 'morningBrushingTime'
  | 'afternoonBrushingTime'
  | 'nightBrushingTime';

export type EditableData = {
  childId: number;
  lastModificationDate: string;
  name?: string | SQL<unknown>;
  lastName?: string | SQL<unknown>;
  gender?: 'M' | 'F' | SQL<unknown>;
  birthDate?: string | SQL<unknown>;
  morningBrushingTime?: string | SQL<unknown>;
  afternoonBrushingTime?: string | SQL<unknown>;
  nightBrushingTime?: string | SQL<unknown>;
}
