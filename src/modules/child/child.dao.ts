import { childTable } from '../../config/db/schema';
import { ChildTableTypes } from './child.types';
import { DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from '../../config/db/schema';
import { DataAccessObject } from '../../types/daos.interface';

/**
 * Clase de acceso a datos (DAO) para la entidad Child.
 * Maneja todas las operaciones de base de datos relacionadas con los niños.
 */
export class ChildDao implements DataAccessObject<ChildTableTypes> {
	private db: DrizzleD1Database<typeof schema>;

	constructor(db: DrizzleD1Database<typeof schema>) {
		this.db = db;
	}

	async create(data: Omit<ChildTableTypes, 'userId'>): Promise<void> {
		await this.db.insert(childTable).values(data);
	}

	async fetchUserChilds(id: number): Promise<Array<Omit<ChildTableTypes, 'lastModificationDate'>> | undefined> {
		return await this.db.query.childTable.findMany({
			where: (model, { eq }) => eq(model.childId, id),
			orderBy: (model, { asc }) => asc(model.creationDate)
		});
	}

	async fetchById(id: number): Promise<ChildTableTypes | undefined> {
		return await this.db.query.childTable.findFirst({
			where: (model, { eq }) => eq(model.childId, id)
		});
	}
}
