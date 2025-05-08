import { drizzle } from 'drizzle-orm/d1';
import { child_table } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';

export class ChildDao {
  constructor(private env: { DB: D1Database }) {}

  private get db() {
    return drizzle(this.env.DB);
  }

  async getAll(): Promise<any[]> {
    return await this.db
      .select()
      .from(child_table)
      .where(eq(child_table.is_active, true));
  }

  async add(child: {
    father_id: number;
    name: string;
    last_name: string;
    gender: 'M' | 'F';
    birth_date: string;
    morning_brushing_time: string;
    afternoon_brushing_time: string;
    night_brushing_time: string;
  }): Promise<any> {
    const now = new Date().toISOString();

    const result = await this.db
      .insert(child_table)
      .values({
        ...child,
        creation_date: now,
        last_modification_date: now,
        is_active: true,
      })
      .returning();

    return result[0];
  }
}

