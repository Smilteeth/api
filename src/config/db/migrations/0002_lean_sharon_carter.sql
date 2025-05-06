ALTER TABLE `ChildLessons` RENAME TO `ChildLesson`;--> statement-breakpoint
ALTER TABLE `MedicalAlerts` RENAME TO `MedicalAlert`;--> statement-breakpoint
ALTER TABLE `RadiologyTests` RENAME TO `RadiologyTest`;--> statement-breakpoint
ALTER TABLE `MedicalAlert` RENAME COLUMN "id" TO "medical_alert_id";--> statement-breakpoint
ALTER TABLE `RadiologyTest` RENAME COLUMN "id" TO "radiology_test_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ChildLesson` (
	`child_lesson_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` integer,
	`child_id` integer,
	`date_watched` text(26) NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`lesson_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ChildLesson`("child_lesson_id", "lesson_id", "child_id", "date_watched", "status") SELECT "child_lesson_id", "lesson_id", "child_id", "date_watched", "status" FROM `ChildLesson`;--> statement-breakpoint
DROP TABLE `ChildLesson`;--> statement-breakpoint
ALTER TABLE `__new_ChildLesson` RENAME TO `ChildLesson`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_MedicalAlert` (
	`medical_alert_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`alert_type` text NOT NULL,
	`description` text(255),
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_MedicalAlert`("medical_alert_id", "patient_id", "alert_type", "description") SELECT "medical_alert_id", "patient_id", "alert_type", "description" FROM `MedicalAlert`;--> statement-breakpoint
DROP TABLE `MedicalAlert`;--> statement-breakpoint
ALTER TABLE `__new_MedicalAlert` RENAME TO `MedicalAlert`;--> statement-breakpoint
CREATE TABLE `__new_RadiologyTest` (
	`radiology_test_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`test_type` text NOT NULL,
	`test_results` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_RadiologyTest`("radiology_test_id", "patient_id", "test_type", "test_results") SELECT "radiology_test_id", "patient_id", "test_type", "test_results" FROM `RadiologyTest`;--> statement-breakpoint
DROP TABLE `RadiologyTest`;--> statement-breakpoint
ALTER TABLE `__new_RadiologyTest` RENAME TO `RadiologyTest`;--> statement-breakpoint
CREATE TABLE `__new_ConsentForm` (
	`consent_form_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`dentist_id` integer,
	`consent_given` integer NOT NULL,
	`consent_details` text NOT NULL,
	`dentist_signature` text NOT NULL,
	`father_signature` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dentist_id`) REFERENCES `Dentist`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ConsentForm`("consent_form_id", "patient_id", "dentist_id", "consent_given", "consent_details", "dentist_signature", "father_signature") SELECT "consent_form_id", "patient_id", "dentist_id", "consent_given", "consent_details", "dentist_signature", "father_signature" FROM `ConsentForm`;--> statement-breakpoint
DROP TABLE `ConsentForm`;--> statement-breakpoint
ALTER TABLE `__new_ConsentForm` RENAME TO `ConsentForm`;--> statement-breakpoint
CREATE TABLE `__new_MedicalHistory` (
	`medical_history_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`emergency_reason` integer,
	`discomfort_relief_reason` integer,
	`revision_reason` integer,
	`other_reason` text,
	`disease_start_date` text(26) NOT NULL,
	`symptoms` text NOT NULL,
	`progression` text NOT NULL,
	`treatment_used` text NOT NULL,
	`current_state` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_MedicalHistory`("medical_history_id", "patient_id", "emergency_reason", "discomfort_relief_reason", "revision_reason", "other_reason", "disease_start_date", "symptoms", "progression", "treatment_used", "current_state") SELECT "medical_history_id", "patient_id", "emergency_reason", "discomfort_relief_reason", "revision_reason", "other_reason", "disease_start_date", "symptoms", "progression", "treatment_used", "current_state" FROM `MedicalHistory`;--> statement-breakpoint
DROP TABLE `MedicalHistory`;--> statement-breakpoint
ALTER TABLE `__new_MedicalHistory` RENAME TO `MedicalHistory`;--> statement-breakpoint
CREATE TABLE `__new_PhysicalExamination` (
	`physical_examination_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`pulse` text NOT NULL,
	`blood_pressure` text NOT NULL,
	`weight` text NOT NULL,
	`temperature` text NOT NULL,
	`respiratory_rate` text NOT NULL,
	`tmj_exam` text NOT NULL,
	`muscle_exam` text NOT NULL,
	`soft_tissue_exam` text NOT NULL,
	`periodontal_exam` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_PhysicalExamination`("physical_examination_id", "patient_id", "pulse", "blood_pressure", "weight", "temperature", "respiratory_rate", "tmj_exam", "muscle_exam", "soft_tissue_exam", "periodontal_exam") SELECT "physical_examination_id", "patient_id", "pulse", "blood_pressure", "weight", "temperature", "respiratory_rate", "tmj_exam", "muscle_exam", "soft_tissue_exam", "periodontal_exam" FROM `PhysicalExamination`;--> statement-breakpoint
DROP TABLE `PhysicalExamination`;--> statement-breakpoint
ALTER TABLE `__new_PhysicalExamination` RENAME TO `PhysicalExamination`;--> statement-breakpoint
CREATE TABLE `__new_TreatmentPlan` (
	`treatment_plan_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`diagnosis` text NOT NULL,
	`prognosis` text NOT NULL,
	`treatment_description` text(255) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_TreatmentPlan`("treatment_plan_id", "patient_id", "diagnosis", "prognosis", "treatment_description") SELECT "treatment_plan_id", "patient_id", "diagnosis", "prognosis", "treatment_description" FROM `TreatmentPlan`;--> statement-breakpoint
DROP TABLE `TreatmentPlan`;--> statement-breakpoint
ALTER TABLE `__new_TreatmentPlan` RENAME TO `TreatmentPlan`;--> statement-breakpoint
CREATE TABLE `__new_Appointment` (
	`appointment_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dentist_id` integer,
	`child_id` integer,
	`reason` text(255) NOT NULL,
	`appointment_datetime` text(26) NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`dentist_id`) REFERENCES `Dentist`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Appointment`("appointment_id", "dentist_id", "child_id", "reason", "appointment_datetime", "creation_date", "last_modification_date", "is_active") SELECT "appointment_id", "dentist_id", "child_id", "reason", "appointment_datetime", "creation_date", "last_modification_date", "is_active" FROM `Appointment`;--> statement-breakpoint
DROP TABLE `Appointment`;--> statement-breakpoint
ALTER TABLE `__new_Appointment` RENAME TO `Appointment`;--> statement-breakpoint
CREATE TABLE `__new_Brush` (
	`brush_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`child_id` integer,
	`brush_datetime` text(26) NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Brush`("brush_id", "child_id", "brush_datetime") SELECT "brush_id", "child_id", "brush_datetime" FROM `Brush`;--> statement-breakpoint
DROP TABLE `Brush`;--> statement-breakpoint
ALTER TABLE `__new_Brush` RENAME TO `Brush`;--> statement-breakpoint
CREATE TABLE `__new_CancelledAppointment` (
	`appointment_id` integer PRIMARY KEY NOT NULL,
	`reason` text(255) NOT NULL,
	`date_cancelled` text DEFAULT (CURRENT_DATE) NOT NULL,
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_CancelledAppointment`("appointment_id", "reason", "date_cancelled") SELECT "appointment_id", "reason", "date_cancelled" FROM `CancelledAppointment`;--> statement-breakpoint
DROP TABLE `CancelledAppointment`;--> statement-breakpoint
ALTER TABLE `__new_CancelledAppointment` RENAME TO `CancelledAppointment`;--> statement-breakpoint
CREATE TABLE `__new_ChildBackground` (
	`child_background_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`child_id` integer,
	`type` text NOT NULL,
	`description` text(255) NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ChildBackground`("child_background_id", "child_id", "type", "description") SELECT "child_background_id", "child_id", "type", "description" FROM `ChildBackground`;--> statement-breakpoint
DROP TABLE `ChildBackground`;--> statement-breakpoint
ALTER TABLE `__new_ChildBackground` RENAME TO `ChildBackground`;--> statement-breakpoint
CREATE TABLE `__new_Child` (
	`child_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`father_id` integer,
	`name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`gender` text(1) NOT NULL,
	`birth_date` text(26) NOT NULL,
	`morning_brushing_time` text(8) NOT NULL,
	`afternoon_brushing_time` text(8) NOT NULL,
	`night_brushing_time` text(8) NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`father_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Child`("child_id", "father_id", "name", "last_name", "gender", "birth_date", "morning_brushing_time", "afternoon_brushing_time", "night_brushing_time", "creation_date", "last_modification_date", "is_active") SELECT "child_id", "father_id", "name", "last_name", "gender", "birth_date", "morning_brushing_time", "afternoon_brushing_time", "night_brushing_time", "creation_date", "last_modification_date", "is_active" FROM `Child`;--> statement-breakpoint
DROP TABLE `Child`;--> statement-breakpoint
ALTER TABLE `__new_Child` RENAME TO `Child`;--> statement-breakpoint
CREATE TABLE `__new_ClinicHistoryFile` (
	`clinic_history_file_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clinic_history_id` integer,
	`url` text NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`clinic_history_id`) REFERENCES `ClinicHistory`(`clinic_history_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ClinicHistoryFile`("clinic_history_file_id", "clinic_history_id", "url", "creation_date", "last_modification_date", "is_active") SELECT "clinic_history_file_id", "clinic_history_id", "url", "creation_date", "last_modification_date", "is_active" FROM `ClinicHistoryFile`;--> statement-breakpoint
DROP TABLE `ClinicHistoryFile`;--> statement-breakpoint
ALTER TABLE `__new_ClinicHistoryFile` RENAME TO `ClinicHistoryFile`;--> statement-breakpoint
CREATE TABLE `__new_ClinicHistory` (
	`clinic_history_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`appointment_id` integer,
	`diagnostic` text NOT NULL,
	`proposed_treatment` text NOT NULL,
	`performed_treatment` text NOT NULL,
	`description` text(255) NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ClinicHistory`("clinic_history_id", "appointment_id", "diagnostic", "proposed_treatment", "performed_treatment", "description", "creation_date", "last_modification_date", "is_active") SELECT "clinic_history_id", "appointment_id", "diagnostic", "proposed_treatment", "performed_treatment", "description", "creation_date", "last_modification_date", "is_active" FROM `ClinicHistory`;--> statement-breakpoint
DROP TABLE `ClinicHistory`;--> statement-breakpoint
ALTER TABLE `__new_ClinicHistory` RENAME TO `ClinicHistory`;--> statement-breakpoint
CREATE UNIQUE INDEX `ClinicHistory_appointment_id_unique` ON `ClinicHistory` (`appointment_id`);--> statement-breakpoint
CREATE TABLE `__new_Course` (
	`course_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
INSERT INTO `__new_Course`("course_id", "name", "description", "creation_date", "last_modification_date", "is_active") SELECT "course_id", "name", "description", "creation_date", "last_modification_date", "is_active" FROM `Course`;--> statement-breakpoint
DROP TABLE `Course`;--> statement-breakpoint
ALTER TABLE `__new_Course` RENAME TO `Course`;--> statement-breakpoint
CREATE TABLE `__new_Dentist` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`professional_license` text(10) NOT NULL,
	`university` text(255),
	`speciality` text(255),
	`about` text(255),
	`service_start_time` text(26) NOT NULL,
	`service_end_time` text(26) NOT NULL,
	`phone_number` text(10) NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Dentist`("user_id", "professional_license", "university", "speciality", "about", "service_start_time", "service_end_time", "phone_number", "latitude", "longitude") SELECT "user_id", "professional_license", "university", "speciality", "about", "service_start_time", "service_end_time", "phone_number", "latitude", "longitude" FROM `Dentist`;--> statement-breakpoint
DROP TABLE `Dentist`;--> statement-breakpoint
ALTER TABLE `__new_Dentist` RENAME TO `Dentist`;--> statement-breakpoint
CREATE UNIQUE INDEX `Dentist_professional_license_unique` ON `Dentist` (`professional_license`);--> statement-breakpoint
CREATE TABLE `__new_HelpDevice` (
	`help_device_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`help_device` text NOT NULL,
	`help_device_description` text(255) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_HelpDevice`("help_device_id", "help_device", "help_device_description") SELECT "help_device_id", "help_device", "help_device_description" FROM `HelpDevice`;--> statement-breakpoint
DROP TABLE `HelpDevice`;--> statement-breakpoint
ALTER TABLE `__new_HelpDevice` RENAME TO `HelpDevice`;--> statement-breakpoint
CREATE TABLE `__new_ItemsOwned` (
	`items_owned_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mascot_item_id` integer,
	`child_id` integer,
	`purchase_date` text DEFAULT (CURRENT_DATE),
	`price` real NOT NULL,
	FOREIGN KEY (`mascot_item_id`) REFERENCES `MascotItem`(`mascot_item_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ItemsOwned`("items_owned_id", "mascot_item_id", "child_id", "purchase_date", "price") SELECT "items_owned_id", "mascot_item_id", "child_id", "purchase_date", "price" FROM `ItemsOwned`;--> statement-breakpoint
DROP TABLE `ItemsOwned`;--> statement-breakpoint
ALTER TABLE `__new_ItemsOwned` RENAME TO `ItemsOwned`;--> statement-breakpoint
CREATE TABLE `__new_Lesson` (
	`lesson_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer,
	`name` text(255) NOT NULL,
	`content_url` text NOT NULL,
	`duration` real NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Lesson`("lesson_id", "course_id", "name", "content_url", "duration", "creation_date", "last_modification_date", "is_active") SELECT "lesson_id", "course_id", "name", "content_url", "duration", "creation_date", "last_modification_date", "is_active" FROM `Lesson`;--> statement-breakpoint
DROP TABLE `Lesson`;--> statement-breakpoint
ALTER TABLE `__new_Lesson` RENAME TO `Lesson`;--> statement-breakpoint
CREATE TABLE `__new_MascotItem` (
	`mascot_item_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`price` real NOT NULL,
	`content_url` text NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
INSERT INTO `__new_MascotItem`("mascot_item_id", "name", "price", "content_url", "creation_date", "last_modification_date", "is_active") SELECT "mascot_item_id", "name", "price", "content_url", "creation_date", "last_modification_date", "is_active" FROM `MascotItem`;--> statement-breakpoint
DROP TABLE `MascotItem`;--> statement-breakpoint
ALTER TABLE `__new_MascotItem` RENAME TO `MascotItem`;--> statement-breakpoint
CREATE TABLE `__new_RescheduledAppointment` (
	`appointment_id` integer PRIMARY KEY NOT NULL,
	`reason` text(255) NOT NULL,
	`rescheduled_date` text(26) NOT NULL,
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_RescheduledAppointment`("appointment_id", "reason", "rescheduled_date") SELECT "appointment_id", "reason", "rescheduled_date" FROM `RescheduledAppointment`;--> statement-breakpoint
DROP TABLE `RescheduledAppointment`;--> statement-breakpoint
ALTER TABLE `__new_RescheduledAppointment` RENAME TO `RescheduledAppointment`;--> statement-breakpoint
CREATE TABLE `__new_Theet` (
	`theet_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`odontogram_id` integer,
	`theet` integer NOT NULL,
	`theet_face` text NOT NULL,
	`treatment` text NOT NULL,
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`odontogram_id`) REFERENCES `Odontogram`(`odontogram_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Theet`("theet_id", "odontogram_id", "theet", "theet_face", "treatment", "description", "creation_date", "last_modification_date", "is_active") SELECT "theet_id", "odontogram_id", "theet", "theet_face", "treatment", "description", "creation_date", "last_modification_date", "is_active" FROM `Theet`;--> statement-breakpoint
DROP TABLE `Theet`;--> statement-breakpoint
ALTER TABLE `__new_Theet` RENAME TO `Theet`;--> statement-breakpoint
CREATE TABLE `__new_Transaction` (
	`transaction_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ammount` real NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
INSERT INTO `__new_Transaction`("transaction_id", "ammount", "creation_date") SELECT "transaction_id", "ammount", "creation_date" FROM `Transaction`;--> statement-breakpoint
DROP TABLE `Transaction`;--> statement-breakpoint
ALTER TABLE `__new_Transaction` RENAME TO `Transaction`;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`birth_date` text(26) NOT NULL,
	`email` text(255) NOT NULL,
	`password` text(14) NOT NULL,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`type` text NOT NULL,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
INSERT INTO `__new_User`("user_id", "name", "last_name", "birth_date", "email", "password", "creation_date", "last_modification_date", "type", "is_active") SELECT "user_id", "name", "last_name", "birth_date", "email", "password", "creation_date", "last_modification_date", "type", "is_active" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);