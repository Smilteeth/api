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
