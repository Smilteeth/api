CREATE TABLE `Theet` (
	`theet_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`odontogram_id` integer,
	`theet` integer,
	`theet_face` text,
	`treatment` text,
	`description` text(255),
	`creation_date` text DEFAULT (CURRENT_DATE),
	`last_modification_date` text(26),
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`odontogram_id`) REFERENCES `Odontogram`(`odontogram_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `Brush` ADD `child_id` integer REFERENCES Child(child_id);--> statement-breakpoint
ALTER TABLE `ConsentForm` ADD `dentist_id` integer REFERENCES Dentist(user_id);--> statement-breakpoint
ALTER TABLE `Odontogram` ADD `clinic_history_id` integer REFERENCES ClinicHistory(clinic_history_id);--> statement-breakpoint
ALTER TABLE `Odontogram` DROP COLUMN `theet`;--> statement-breakpoint
ALTER TABLE `Odontogram` DROP COLUMN `theet_face`;--> statement-breakpoint
ALTER TABLE `Odontogram` DROP COLUMN `treatment`;