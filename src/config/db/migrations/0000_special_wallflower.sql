CREATE TABLE `Appointment` (
	`appointment_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dentist_id` integer,
	`child_id` integer,
	`reason` text(255),
	`appointment_datetime` text(26),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`dentist_id`) REFERENCES `Dentist`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Brush` (
	`brush_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brush_datetime` text(26)
);
--> statement-breakpoint
CREATE TABLE `CancelledAppointment` (
	`appointment_id` integer PRIMARY KEY NOT NULL,
	`reason` text(255),
	`date_cancelled` text DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ChildBackground` (
	`child_background_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`child_id` integer,
	`type` text,
	`description` text(255),
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ChildLessons` (
	`child_lesson_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` integer,
	`child_id` integer,
	`date_watched` text(26),
	`status` text,
	FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`lesson_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Child` (
	`child_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`father_id` integer,
	`name` text(255),
	`last_name` text(255),
	`gender` text(1),
	`birth_date` text(26),
	`morning_brushing_time` text(8),
	`afternoon_brushing_time` text(8),
	`night_brushing_time` text(8),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`father_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ClinicHistoryFile` (
	`clinic_history_file_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clinic_history_id` integer,
	`url` text,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`clinic_history_id`) REFERENCES `ClinicHistory`(`clinic_history_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ClinicHistory` (
	`clinic_history_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`appointment_id` integer,
	`diagnostic` text,
	`proposed_treatment` text,
	`performed_treatment` text,
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ClinicHistory_appointment_id_unique` ON `ClinicHistory` (`appointment_id`);--> statement-breakpoint
CREATE TABLE `ConsentForm` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`consent_given` integer,
	`consent_details` text,
	`dentist_signature` text,
	`patient_signature` text,
	FOREIGN KEY (`patient_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Course` (
	`course_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255),
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Dentist` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`professional_license` text(10),
	`university` text(255),
	`speciality` text(255),
	`about` text(255),
	`service_start_time` text(26),
	`service_end_time` text(26),
	`phone_number` text(10),
	`latitude` real,
	`longitude` real,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `HelpDevice` (
	`help_device_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`help_device` text,
	`help_device_description` text(255)
);
--> statement-breakpoint
CREATE TABLE `ItemsOwned` (
	`items_owned_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mascot_item_id` integer,
	`child_id` integer,
	`purchase_date` text DEFAULT (CURRENT_DATE),
	`price` real,
	FOREIGN KEY (`mascot_item_id`) REFERENCES `MascotItem`(`mascot_item_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Lesson` (
	`lesson_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer,
	`name` text(255),
	`content_url` text,
	`duration` real,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MascotItem` (
	`mascot_item_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255),
	`price` real,
	`content_url` text,
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `MedicalAlerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`alert_type` text,
	`description` text(255),
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MedicalHistory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`emergency_reason` integer,
	`discomfort_relief_reason` integer,
	`revision_reason` integer,
	`other_reason` text,
	`disease_start_date` text(26),
	`symptoms` text,
	`progression` text,
	`treatment_used` text,
	`current_state` text,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Odontogram` (
	`odontogram_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theet` integer,
	`theet_face` text,
	`treatment` text,
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `PhysicalExamination` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`pulse` text,
	`blood_pressure` text,
	`weight` text,
	`temperature` text,
	`respiratory_rate` text,
	`tmj_exam` text,
	`muscle_exam` text,
	`soft_tissue_exam` text,
	`periodontal_exam` text,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `RadiologyTests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`test_type` text,
	`test_results` text,
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `RescheduledAppointment` (
	`appointment_id` integer PRIMARY KEY NOT NULL,
	`reason` text(255),
	`rescheduled_date` text(26),
	FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Transaction` (
	`transaction_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ammount` real,
	`creation_date` text DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE TABLE `TreatmentPlan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer,
	`diagnosis` text,
	`prognosis` text,
	`treatment_description` text(255),
	FOREIGN KEY (`patient_id`) REFERENCES `Child`(`child_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `User` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255),
	`last_name` text(255),
	`birth_date` text(26),
	`email` text(255),
	`password` text(14),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`type` text,
	`is_active` integer DEFAULT true
);
