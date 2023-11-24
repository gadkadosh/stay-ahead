CREATE TABLE `phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`duration` integer NOT NULL,
	`position` integer NOT NULL,
	`scenario_id` integer NOT NULL,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE INDEX `phase_id_idx` ON `phases` (`id`);--> statement-breakpoint
CREATE INDEX `scenario_id_idx` ON `scenarios` (`id`);