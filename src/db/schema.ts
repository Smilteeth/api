import { sql } from 'drizzle-orm';
import { sqliteTable, int, text, real } from 'drizzle-orm/sqlite-core';

/* In the next file we define the db schema used for the data to store
 * of the application
 *
 * notes:
 *  dates are text because sqlite not supports datetime type
 *  booleans are int because sqlite not supports booleans
 *
 *
 *
 *  made by Rafael Beltran
 */

export const user_table = sqliteTable('User', {
	user_id: int('user_id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	last_name: text('last_name'),
	birth_date: text('birth_date', { length: 26 }),
	email: text('email'),
	password: text('password', { length: 14 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	type: text('type', { enum: ['DENTIST', 'FATHER'] }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const dentist_table = sqliteTable('Dentist', {
	user_id: int('user_id')
		.references(() => user_table.user_id)
		.primaryKey(),
	professional_license: text('professional_license'),
	university: text('university'),
	speciality: text('speciality'),
	about: text('about'),
	service_start_time: text('service_start_time', { length: 26 }),
	service_end_time: text('service_end_time', { length: 26 }),
	phone_number: text('phone_number', { length: 10 }),
	// the following attributes are for the office direction
	latitude: real('latitude'),
	longitude: real('longitude')
});

export const child_table = sqliteTable('Child', {
	child_id: int('child_id').primaryKey({ autoIncrement: true }),
	father_id: int('father_id').references(() => user_table.user_id),
	name: text('name'),
	last_name: text('last_name'),
	gender: text('gender', { length: 1, enum: ['M', 'F'] }),
	birth_date: text('birth_date', { length: 26 }),
	morning_brushing_time: text('morning_brushing_time', { length: 8 }),
	afternoon_brushing_time: text('afternoon_brushing_time', { length: 8 }),
	night_brushing_time: text('night_brushing_time', { length: 8 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const appointment_table = sqliteTable('Appointment', {
	appointment_id: int('appointment_id').primaryKey({ autoIncrement: true }),
	dentist_id: int('dentist_id').references(() => dentist_table.user_id),
	child_id: int('child_id').references(() => child_table.child_id),
	reason: text('reason'),
	appointment_datetime: text('appointment_datetime', { length: 26 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const rescheduled_appointment_table = sqliteTable('RescheduledAppointment', {
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.primaryKey(),
	reason: text('reason'),
	rescheduled_date: text('rescheduled_date', { length: 26 })
});

export const cancelled_appointment_table = sqliteTable('CancelledAppointment', {
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.primaryKey(),
	reason: text('reason'),
	date_cancelled: text('date_cancelled').default(sql`(CURRENT_DATE)`)
});

export const clinic_history_table = sqliteTable('ClinicHistory', {
	clinic_history_id: int('clinic_history_id').primaryKey({ autoIncrement: true }),
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.unique(),
	diagnostic: text('diagnostic'),
	proposed_treatment: text('proposed_treatment'),
	performed_treatment: text('performed_treatment'),
	description: text('description'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const clinic_history_file_table = sqliteTable('clinic_history_file_table', {
	clinic_history_file_id: int('clinic_history_file_id').primaryKey({ autoIncrement: true }),
	clinic_history_id: int('clinic_history_id').references(() => clinic_history_table.clinic_history_id),
	url: text('url'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const odontogram_table = sqliteTable('odontogram', {
	odontogram_id: int('odontogram_id').primaryKey({ autoIncrement: true }),
	theet: int('theet'),
	theet_face: text('theet_face'),
	treatment: text('treatment'),
	description: text('description'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const transaction_table = sqliteTable('Transaction', {
	transaction_id: int('transaction_id').primaryKey({ autoIncrement: true }),
	ammount: real('ammount'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`)
});

export const brush_table = sqliteTable('Brush', {
	brush_id: int('brush_id').primaryKey({ autoIncrement: true }),
	brush_datetime: text('brush_datetime', { length: 26 })
});

export const mascot_item_table = sqliteTable('MascotItem', {
	mascot_item_id: int('mascot_item_id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	price: real('price'),
	content_url: text('content_url'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const items_owned_table = sqliteTable('ItemsOwned', {
	items_owned_id: int('items_owned_id').primaryKey({ autoIncrement: true }),
	mascot_item_id: int('mascot_item_id').references(() => mascot_item_table.mascot_item_id),
	child_id: int('child_id').references(() => child_table.child_id),
	purchase_date: text('purchase_date').default(sql`(CURRENT_DATE)`),
	price: real('price')
});

export const course_table = sqliteTable('Course', {
	course_id: int('course_id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	description: text('description'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const lesson_table = sqliteTable('Lesson', {
	lesson_id: int('lesson_id').primaryKey({ autoIncrement: true }),
	course_id: int('course_id').references(() => course_table.course_id),
	name: text('name'),
	content_url: text('content_url'),
	duration: real('duration'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const child_lesson_table = sqliteTable('ChildLessons', {
	child_lesson_id: int('child_lesson_id').primaryKey({ autoIncrement: true }),
	lesson_id: int('lesson_id').references(() => lesson_table.lesson_id),
	child_id: int('child_id').references(() => child_table.child_id),
	date_watched: text('date_watched', { length: 26 }),
	status: text('status', { enum: ['IN PROGRESS', 'FINISHED'] })
});
