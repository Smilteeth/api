import { DrizzleD1Database } from 'drizzle-orm/d1';
import { DataAccessObject } from '../../types/daos.interface';
import { DentistTableTypes } from './dentist.types';

import * as schema from '../../config/db/schema';
import { dentistTable } from '../../config/db/schema';

export class DentistDao implements DataAccessObject<DentistTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(data: DentistTableTypes): Promise<void> {
		await this.db.insert(dentistTable).values(data);
	}

	async fetchById(id: number): Promise<DentistTableTypes | undefined> {
		return await this.db.query.dentistTable.findFirst({
			where: (model, { eq }) => eq(model.userId, id)
		});
	}
}
