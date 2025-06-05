import { childTable, dentistTable, userTable, brushTable } from '../../config/db/schema';
import { ChildReturnType, ChildTableTypes, EditableData } from './child.types';
import { DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from '../../config/db/schema';
import { DataAccessObject } from '../../types/daos.interface';
import { and, desc, eq, getTableColumns, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

/**
 * Clase de acceso a datos (DAO) para la entidad Child.
 * Maneja todas las operaciones de base de datos relacionadas con los niños.
 */
export class ChildDao implements DataAccessObject<ChildTableTypes | ChildReturnType> {
  private db: DrizzleD1Database<typeof schema>;

  constructor(db: DrizzleD1Database<typeof schema>) {
    this.db = db;
  }

  async create(data: Omit<ChildTableTypes, 'childId' | 'userId' | 'lastModificationDate' | 'creationDate' | 'isActive'>): Promise<void> {
    await this.db.insert(childTable).values(data);
  }

  async edit(data: Omit<EditableData, 'childId'>, fatherId: number, childId: number) {
    await this.db.update(childTable)
      .set(data)
      .where(and(eq(childTable.fatherId, fatherId), eq(childTable.childId, childId)));
  }

  async fetchUserChilds(id: number): Promise<Array<ChildReturnType> | undefined> {
    const fatherTable = alias(userTable, 'fatherTable');

    return await this.db
      .select({
        ...getTableColumns(childTable),
        dentist: sql<string>`concat("Dr.", " ", ${userTable.name}, " ", ${userTable.lastName})`.as('dentist'),
        father: sql<string>`concat(${fatherTable.name}, " ", ${fatherTable.lastName})`.as('father')
      })
      .from(childTable)
      .innerJoin(dentistTable, eq(dentistTable.userId, childTable.dentistId))
      .innerJoin(userTable, eq(userTable.userId, dentistTable.userId))
      .leftJoin(fatherTable, eq(fatherTable.userId, childTable.fatherId))
      .where(or(eq(childTable.fatherId, id), eq(childTable.dentistId, id)))
      .orderBy(desc(childTable.creationDate));
  }

  async fetchById(id: number, userId: number): Promise<ChildReturnType | undefined> {
    const fatherTable = alias(userTable, 'fatherTable');

    const child = await this.db
      .select({
        ...getTableColumns(childTable),
        dentist: sql<string>`concat("Dr.", " ", ${userTable.name}, " ", ${userTable.lastName})`.as('dentist'),
        father: sql<string>`concat(${fatherTable.name}, " ", ${fatherTable.lastName})`.as('father')
      })
      .from(childTable)
      .innerJoin(dentistTable, eq(dentistTable.userId, childTable.dentistId))
      .innerJoin(userTable, eq(userTable.userId, dentistTable.userId))
      .leftJoin(fatherTable, eq(fatherTable.userId, childTable.fatherId))
      .where(and(eq(childTable.childId, id), or(eq(childTable.fatherId, userId), eq(childTable.dentistId, userId))))
      .orderBy(desc(childTable.creationDate)).limit(1);

    return child[0];
  }

  async addBrush(childId: number) {
    return await this.db.insert(brushTable).values({
      childId: childId
    });

  }

  async getChildBrushes(childId: number) {
    return await this.db.query.brushTable.findMany({
      where: (model, { eq }) => eq(model.childId, childId),
      orderBy: (model, { desc }) => desc(model.brushDatetime)
    })
  }
}
