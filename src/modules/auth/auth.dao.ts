import { userTable } from '../../config/db/schema';
import { DataAccessObject } from '../../types/daos.interface';
import { UserTableTypes } from './auth.types';
import { DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from '../../config/db/schema';

export class AuthDao implements DataAccessObject<UserTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(data: Omit<UserTableTypes, 'userId'>): Promise<void> {
		await this.db.insert(userTable).values(data);
	}

	async findIdByEmail(email: string): Promise<UserTableTypes | undefined> {
		return await this.db.query.userTable.findFirst({
			where: (model, { eq }) => eq(model.email, email)
		});
	}

	async fetchById(id: number): Promise<UserTableTypes | undefined> {
		return await this.db.query.userTable.findFirst({
			where: (model, { eq }) => eq(model.userId, id)
		});
	}
}
