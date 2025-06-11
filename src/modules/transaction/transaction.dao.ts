import { DrizzleD1Database } from "drizzle-orm/d1";
import { DataAccessObject } from "../../types/daos.interface";
import { transactionTable } from '../../config/db/schema';

import * as schema from '../../config/db/schema';
import { TransactionTable } from "./transaction.types";

export class TransactionDao implements DataAccessObject<TransactionTable | Array<TransactionTable>> {

  private db: DrizzleD1Database<typeof schema>;

  constructor(db: DrizzleD1Database<typeof schema>) {
    this.db = db;
  }

  async create(data: TransactionTable) {
    await this.db.insert(transactionTable).values(data);
  }

  async fetchById(id: number): Promise<Array<TransactionTable> | undefined> {
    return await this.db.query.transactionTable.findMany({
      where: (model, { eq }) => eq(model.childId, id)
    });
  }
}


