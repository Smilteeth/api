import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

/*
 * This is an example schema, i'd be modified
 */

export const user_table = sqliteTable('user', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name')
});
