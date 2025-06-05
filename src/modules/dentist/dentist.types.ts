import { SQL } from 'drizzle-orm';
import { dbTypes } from '../../config/db/types';

export type DentistTableTypes = dbTypes['DentistTable'];

export type EditableField = 'university'
  | 'speciality'
  | 'about'
  | 'serviceStartTime'
  | 'serviceEndTime'
  | 'phoneNumber'
  | 'latitude'
  | 'longitude';

export type EditableData = {
  speciality?: string | SQL<unknown>;
  about?: string | SQL<unknown>;
  serviceStartTime?: string | SQL<unknown>;
  serviceEndTime?: string | SQL<unknown>;
  phoneNumber?: string | SQL<unknown>;
  latitude?: number | SQL<unknown>;
  longitude?: number | SQL<unknown>;
}
