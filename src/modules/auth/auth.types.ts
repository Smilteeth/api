import { dbTypes } from '../../config/db/types';

export type UserTableTypes = dbTypes['UserTable'];

export interface LogInData {
	email: string;
	password: string;
}
