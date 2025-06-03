import { dbTypes } from '../../config/db/types';

export type AppointmentTableTypes = dbTypes['AppointmentTable'];
export type DeactiveAppointmentTableTypes = dbTypes['DeactiveAppointmentTable'];

export type AppointmentData = Omit<AppointmentTableTypes, "lastModificationDate"> & {
  child: string;
  dentist: string;
};
