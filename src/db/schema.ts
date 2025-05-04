import { sql } from 'drizzle-orm';
import { withReplicas } from 'drizzle-orm/gel-core';
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
	name: text('name', { length: 255 }),
	last_name: text('last_name', { length: 255 }),
	birth_date: text('birth_date', { length: 26 }),
	email: text('email', { length: 255 }),
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
	professional_license: text('professional_license', { length: 10 }),
	university: text('university', { length: 255 }),
	speciality: text('speciality', { length: 255 }),
	about: text('about', { length: 255 }),
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
	name: text('name', { length: 255 }),
	last_name: text('last_name', { length: 255 }),
	gender: text('gender', { length: 1, enum: ['M', 'F'] }),
	birth_date: text('birth_date', { length: 26 }),
	morning_brushing_time: text('morning_brushing_time', { length: 8 }),
	afternoon_brushing_time: text('afternoon_brushing_time', { length: 8 }),
	night_brushing_time: text('night_brushing_time', { length: 8 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const help_device_table = sqliteTable('HelpDevice', {
	help_device_id: int('help_device_id').primaryKey({ autoIncrement: true }),
	help_device: text('help_device', {
		enum: [
			'DIGESTIVE',
			'RESPIRATORY',
			'CARDIOVASCULAR',
			'GENITOURINARY',
			'ENDOCRINE',
			'HEMATOPOIETIC',
			'NERVOUS',
			'MUSCULO-SKELETAL',
			'TEGUMENTARY'
		]
	}),
	help_device_description: text('help_device_description', { length: 255 })
});

export const child_background_table = sqliteTable('ChildBackground', {
	child_background_id: int('child_background_id').primaryKey({ autoIncrement: true }),
	child_id: int('child_id').references(() => child_table.child_id),
	type: text('type', { enum: ['FAMILY', 'PERSONAL', 'PATHOLOGIC', 'SURGICAL'] }),
	description: text('description', { length: 255 })
});

export const appointment_table = sqliteTable('Appointment', {
	appointment_id: int('appointment_id').primaryKey({ autoIncrement: true }),
	dentist_id: int('dentist_id').references(() => dentist_table.user_id),
	child_id: int('child_id').references(() => child_table.child_id),
	reason: text('reason', { length: 255 }),
	appointment_datetime: text('appointment_datetime', { length: 26 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const rescheduled_appointment_table = sqliteTable('RescheduledAppointment', {
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.primaryKey(),
	reason: text('reason', { length: 255 }),
	rescheduled_date: text('rescheduled_date', { length: 26 })
});

export const cancelled_appointment_table = sqliteTable('CancelledAppointment', {
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.primaryKey(),
	reason: text('reason', { length: 255 }),
	date_cancelled: text('date_cancelled').default(sql`(CURRENT_DATE)`)
});

export const clinic_history_table = sqliteTable('ClinicHistory', {
	clinic_history_id: int('clinic_history_id').primaryKey({
		autoIncrement: true
	}),
	appointment_id: int('appointment_id')
		.references(() => appointment_table.appointment_id)
		.unique(),
	diagnostic: text('diagnostic'),
	proposed_treatment: text('proposed_treatment'),
	performed_treatment: text('performed_treatment'),
	description: text('description', { length: 255 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const clinic_history_file_table = sqliteTable('ClinicHistoryFile', {
	clinic_history_file_id: int('clinic_history_file_id').primaryKey({
		autoIncrement: true
	}),
	clinic_history_id: int('clinic_history_id').references(() => clinic_history_table.clinic_history_id),
	url: text('url'),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const medical_history_table = sqliteTable('MedicalHistory', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => child_table.child_id),
	emergency_reason: int('emergency_reason', { mode: 'boolean' }),
	discomfort_relief_reason: int('discomfort_relief_reason', { mode: 'boolean' }),
	revision_reason: int('revision_reason', { mode: 'boolean' }),
	other_reason: text('other_reason'),
	disease_start_date: text('disease_start_date', { length: 26 }),
	symptoms: text('symptoms'),
	progression: text('progression'),
	treatment_used: text('treatment_used'),
	current_state: text('current_state')
});

export const physical_examination_table = sqliteTable('PhysicalExamination', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => child_table.child_id),
	pulse: text('pulse'),
	blood_pressure: text('blood_pressure'),
	weight: text('weight'),
	temperature: text('temperature'),
	respiratory_rate: text('respiratory_rate'),
	tmj_exam: text('tmj_exam'),
	muscle_exam: text('muscle_exam'),
	soft_tissue_exam: text('soft_tissue_exam'),
	periodontal_exam: text('periodontal_exam')
});

export const treatment_plan_table = sqliteTable('TreatmentPlan', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => child_table.child_id),
	diagnosis: text('diagnosis'),
	prognosis: text('prognosis'),
	treatment_description: text('treatment_description', { length: 255 })
});

export const consent_form_table = sqliteTable('ConsentForm', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => user_table.user_id),
	dentist_id: int('dentist_id').references(() => dentist_table.user_id),
	consent_given: int('consent_given', { mode: 'boolean' }),
	consent_details: text('consent_details'),
	dentist_signature: text('dentist_signature'),
	patient_signature: text('patient_signature')
});

export const radiology_tests_table = sqliteTable('RadiologyTests', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => child_table.child_id),
	test_type: text('test_type'),
	test_results: text('test_results')
});

export const medical_alerts_table = sqliteTable('MedicalAlerts', {
	id: int('id').primaryKey({ autoIncrement: true }),
	patient_id: int('patient_id').references(() => child_table.child_id),
	alert_type: text('alert_type'),
	description: text('description', { length: 255 })
});

export const odontogram_table = sqliteTable('Odontogram', {
	odontogram_id: int('odontogram_id').primaryKey({ autoIncrement: true }),
	clinic_history_id: int('clinic_history_id').references(() => clinic_history_table.clinic_history_id),
	description: text('description', { length: 255 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const theet_table = sqliteTable('Theet', {
	theet_id: int('theet_id').primaryKey({ autoIncrement: true }),
	odontogram_id: int('odontogram_id').references(() => odontogram_table.odontogram_id),
	theet: int('theet'),
	theet_face: text('theet_face'),
	treatment: text('treatment'),
	description: text('description', { length: 255 }),
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
	child_id: int('child_id').references(() => child_table.child_id),
	brush_datetime: text('brush_datetime', { length: 26 })
});

export const mascot_item_table = sqliteTable('MascotItem', {
	mascot_item_id: int('mascot_item_id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 255 }),
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
	name: text('name', { length: 255 }),
	description: text('description', { length: 255 }),
	creation_date: text('creation_date').default(sql`(CURRENT_DATE)`),
	last_modification_date: text('last_modification_date', { length: 26 }),
	is_active: int('is_active', { mode: 'boolean' }).default(true)
});

export const lesson_table = sqliteTable('Lesson', {
	lesson_id: int('lesson_id').primaryKey({ autoIncrement: true }),
	course_id: int('course_id').references(() => course_table.course_id),
	name: text('name', { length: 255 }),
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
