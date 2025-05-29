import {
	appointmentTable,
	brushTable,
	childBackgroundTable,
	childLessonTable,
	childTable,
	clinicHistoryFileTable,
	clinicHistoryTable,
	consentFormTable,
	courseTable,
	deactiveAppointmentTable,
	dentistTable,
	helpDeviceTable,
	itemsOwnedTable,
	lessonTable,
	mascotItemTable,
	medicalAlertTable,
	medicalHistoryTable,
	odontogramTable,
	physicalExaminationTable,
	radiologyTestTable,
	theetTable,
	transactionTable,
	treatmentPlanTable,
	userTable
} from './schema';

export type dbTypes = {
	UserTable: typeof userTable.$inferSelect;
	DentistTable: typeof dentistTable.$inferSelect;
	ChildTable: typeof childTable.$inferSelect;
	HelpDeviceTable: typeof helpDeviceTable.$inferSelect;
	ChildBackgrounTable: typeof childBackgroundTable.$inferSelect;
	AppointmentTable: typeof appointmentTable.$inferSelect;
	DeactiveAppointmentTable: typeof deactiveAppointmentTable.$inferSelect;
	ClinicHistoryTable: typeof clinicHistoryTable.$inferSelect;
	clinicHistoryFileTable: typeof clinicHistoryFileTable.$inferSelect;
	MedicalHistoryTable: typeof medicalHistoryTable.$inferSelect;
	PhsysicalExaminationTable: typeof physicalExaminationTable.$inferSelect;
	TreatmentPlanTable: typeof treatmentPlanTable.$inferSelect;
	ConsentFormTable: typeof consentFormTable.$inferSelect;
	RadiologyTestTable: typeof radiologyTestTable.$inferSelect;
	MedicalAlertTable: typeof medicalAlertTable.$inferSelect;
	OdontogramTable: typeof odontogramTable.$inferSelect;
	TheetTable: typeof theetTable.$inferSelect;
	TransactionTable: typeof transactionTable.$inferSelect;
	BrushTable: typeof brushTable.$inferSelect;
	MascotItemTable: typeof mascotItemTable.$inferSelect;
	ItemsOwnedTable: typeof itemsOwnedTable.$inferSelect;
	CourseTable: typeof courseTable.$inferSelect;
	LessonTable: typeof lessonTable.$inferSelect;
	ChildLessonTable: typeof childLessonTable.$inferSelect;
};
