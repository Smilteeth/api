import { sql } from 'drizzle-orm';
import { sqliteTable, int, text, real } from 'drizzle-orm/sqlite-core';

/* In the next file we define the db schema used for the data to store
 * of the application
 *
 * notes:
 *  dates are text because sqlite not supports datetime type
 *  booleans are int because sqlite not supports booleans
 *
 *  made by Rafael Beltran
 */

export const userTable = sqliteTable('User', {
	userId: int('user_id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 255 }).notNull(),
	lastName: text('last_name', { length: 255 }).notNull(),
	birthDate: text('birth_date', { length: 26 }).notNull(),
	email: text('email', { length: 255 }).unique().notNull(),
	password: text('password', { length: 14 }).notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	type: text('type', { enum: ['DENTIST', 'FATHER'] }).notNull(),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const dentistTable = sqliteTable('Dentist', {
	userId: int('user_id')
		.references(() => userTable.userId)
		.primaryKey(),
	professionalLicense: text('professional_license', { length: 10 }).unique().notNull(),
	university: text('university', { length: 255 }),
	speciality: text('speciality', { length: 255 }),
	about: text('about', { length: 255 }),
	serviceStartTime: text('service_start_time', { length: 26 }).notNull(),
	serviceEndTime: text('service_end_time', { length: 26 }).notNull(),
	phoneNumber: text('phone_number', { length: 10 }).notNull(),
	// the following attributes are for the office direction
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull()
});

	export const childTable = sqliteTable('Child', {
		childId: int('child_id').primaryKey({ autoIncrement: true }),
		fatherId: int('father_id').references(() => userTable.userId).notNull(), // NOTE: Para evitar el error en dao
		name: text('name', { length: 255 }).notNull(),
		lastName: text('last_name', { length: 255 }).notNull(),
		gender: text('gender', { length: 1, enum: ['M', 'F'] }).notNull(),
		birthDate: text('birth_date', { length: 26 }).notNull(),
		morningBrushingTime: text('morning_brushing_time', { length: 8 }).notNull(),
		afternoonBrushingTime: text('afternoon_brushing_time', { length: 8 }).notNull(),
		nightBrushingTime: text('night_brushing_time', { length: 8 }).notNull(),
		creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
		lastModificationDate: text('last_modification_date', { length: 26 }),
		isActive: int('is_active', { mode: 'boolean' }).default(true)
	});

export const helpDeviceTable = sqliteTable('HelpDevice', {
	helpDeviceId: int('help_device_id').primaryKey({ autoIncrement: true }),
	helpDevice: text('help_device', {
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
	}).notNull(),
	helpDeviceDescription: text('help_device_description', { length: 255 }).notNull()
});

export const childBackgroundTable = sqliteTable('ChildBackground', {
	childBackgroundId: int('child_background_id').primaryKey({ autoIncrement: true }),
	childId: int('child_id').references(() => childTable.childId),
	type: text('type', { enum: ['FAMILY', 'PERSONAL', 'PATHOLOGIC', 'SURGICAL'] }).notNull(),
	description: text('description', { length: 255 }).notNull()
});

export const appointmentTable = sqliteTable('Appointment', {
	appointmentId: int('appointment_id').primaryKey({ autoIncrement: true }),
	dentistId: int('dentist_id').references(() => dentistTable.userId),
	fatherId: int('father_id').references(() => userTable.userId),
	childId: int('child_id').references(() => childTable.childId),
	reason: text('reason', { length: 255 }).notNull(),
	appointmentDatetime: text('appointment_datetime', { length: 26 }).notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const rescheduledAppointmentTable = sqliteTable('RescheduledAppointment', {
	appointmentId: int('appointment_id')
		.references(() => appointmentTable.appointmentId)
		.primaryKey(),
	reason: text('reason', { length: 255 }).notNull(),
	rescheduledDate: text('rescheduled_date', { length: 26 }).notNull()
});

export const cancelledAppointmentTable = sqliteTable('CancelledAppointment', {
	appointmentId: int('appointment_id')
		.references(() => appointmentTable.appointmentId)
		.primaryKey(),
	reason: text('reason', { length: 255 }).notNull(),
	dateCancelled: text('date_cancelled')
		.default(sql`(CURRENT_DATE)`)
		.notNull()
});

export const clinicHistoryTable = sqliteTable('ClinicHistory', {
	clinicHistoryId: int('clinic_history_id').primaryKey({
		autoIncrement: true
	}),
	appointmentId: int('appointment_id')
		.references(() => appointmentTable.appointmentId)
		.unique(),
	diagnostic: text('diagnostic').notNull(),
	proposedTreatment: text('proposed_treatment').notNull(),
	performedTreatment: text('performed_treatment').notNull(),
	description: text('description', { length: 255 }).notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const clinicHistoryFileTable = sqliteTable('ClinicHistoryFile', {
	clinicHistoryFileId: int('clinic_history_file_id').primaryKey({
		autoIncrement: true
	}),
	clinicHistoryId: int('clinic_history_id').references(() => clinicHistoryTable.clinicHistoryId),
	url: text('url').notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const medicalHistoryTable = sqliteTable('MedicalHistory', {
	medicalHistoryId: int('medical_history_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => childTable.childId),
	emergencyReason: int('emergency_reason', { mode: 'boolean' }),
	discomfortReliefReason: int('discomfort_relief_reason', { mode: 'boolean' }),
	revisionReason: int('revision_reason', { mode: 'boolean' }),
	otherReason: text('other_reason'),
	diseaseStartDate: text('disease_start_date', { length: 26 }).notNull(),
	symptoms: text('symptoms').notNull(),
	progression: text('progression').notNull(),
	treatmentUsed: text('treatment_used').notNull(),
	currentState: text('current_state').notNull()
});

export const physicalExaminationTable = sqliteTable('PhysicalExamination', {
	physicalExaminationId: int('physical_examination_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => childTable.childId),
	pulse: text('pulse').notNull(),
	bloodPressure: text('blood_pressure').notNull(),
	weight: text('weight').notNull(),
	temperature: text('temperature').notNull(),
	respiratoryRate: text('respiratory_rate').notNull(),
	tmjExam: text('tmj_exam').notNull(),
	muscleExam: text('muscle_exam').notNull(),
	softTissueExam: text('soft_tissue_exam').notNull(),
	periodontalExam: text('periodontal_exam').notNull()
});

export const treatmentPlanTable = sqliteTable('TreatmentPlan', {
	treatmentPlanId: int('treatment_plan_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => childTable.childId),
	diagnosis: text('diagnosis').notNull(),
	prognosis: text('prognosis').notNull(),
	treatmentDescription: text('treatment_description', { length: 255 }).notNull()
});

export const consentFormTable = sqliteTable('ConsentForm', {
	consentFormId: int('consent_form_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => userTable.userId),
	dentistId: int('dentist_id').references(() => dentistTable.userId),
	consentGiven: int('consent_given', { mode: 'boolean' }).notNull(),
	consentDetails: text('consent_details').notNull(),
	dentistSignature: text('dentist_signature').notNull(),
	fatherSignature: text('father_signature').notNull()
});

export const radiologyTestTable = sqliteTable('RadiologyTest', {
	radiologyTestId: int('radiology_test_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => childTable.childId),
	testType: text('test_type').notNull(),
	testResults: text('test_results').notNull()
});

export const medicalAlertTable = sqliteTable('MedicalAlert', {
	medicalAlertId: int('medical_alert_id').primaryKey({ autoIncrement: true }),
	patientId: int('patient_id').references(() => childTable.childId),
	alertType: text('alert_type').notNull(),
	description: text('description', { length: 255 })
});

export const odontogramTable = sqliteTable('Odontogram', {
	odontogramId: int('odontogram_id').primaryKey({ autoIncrement: true }),
	clinicHistoryId: int('clinic_history_id').references(() => clinicHistoryTable.clinicHistoryId),
	description: text('description', { length: 255 }),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const theetTable = sqliteTable('Theet', {
	theetId: int('theet_id').primaryKey({ autoIncrement: true }),
	odontogramId: int('odontogram_id').references(() => odontogramTable.odontogramId),
	theet: int('theet').notNull(),
	theetFace: text('theet_face').notNull(),
	treatment: text('treatment').notNull(),
	description: text('description', { length: 255 }),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const transactionTable = sqliteTable('Transaction', {
	transactionId: int('transaction_id').primaryKey({ autoIncrement: true }),
	ammount: real('ammount').notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`)
});

export const brushTable = sqliteTable('Brush', {
	brushId: int('brush_id').primaryKey({ autoIncrement: true }),
	childId: int('child_id').references(() => childTable.childId),
	brushDatetime: text('brush_datetime', { length: 26 }).notNull()
});

export const mascotItemTable = sqliteTable('MascotItem', {
	mascotItemId: int('mascot_item_id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 255 }).notNull(),
	price: real('price').notNull(),
	contentUrl: text('content_url').notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const itemsOwnedTable = sqliteTable('ItemsOwned', {
	itemsOwnedId: int('items_owned_id').primaryKey({ autoIncrement: true }),
	mascotItemId: int('mascot_item_id').references(() => mascotItemTable.mascotItemId),
	childId: int('child_id').references(() => childTable.childId),
	purchaseDate: text('purchase_date').default(sql`(CURRENT_DATE)`),
	price: real('price').notNull()
});

export const courseTable = sqliteTable('Course', {
	courseId: int('course_id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 255 }).notNull(),
	description: text('description', { length: 255 }),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const lessonTable = sqliteTable('Lesson', {
	lessonId: int('lesson_id').primaryKey({ autoIncrement: true }),
	courseId: int('course_id').references(() => courseTable.courseId),
	name: text('name', { length: 255 }).notNull(),
	contentUrl: text('content_url').notNull(),
	duration: real('duration').notNull(),
	creationDate: text('creation_date').default(sql`(CURRENT_DATE)`),
	lastModificationDate: text('last_modification_date', { length: 26 }),
	isActive: int('is_active', { mode: 'boolean' }).default(true)
});

export const childLessonTable = sqliteTable('ChildLesson', {
	childLessonId: int('child_lesson_id').primaryKey({ autoIncrement: true }),
	lessonId: int('lesson_id').references(() => lessonTable.lessonId),
	childId: int('child_id').references(() => childTable.childId),
	dateWatched: text('date_watched', { length: 26 }).notNull(),
	status: text('status', { enum: ['IN PROGRESS', 'FINISHED'] }).notNull()
});
