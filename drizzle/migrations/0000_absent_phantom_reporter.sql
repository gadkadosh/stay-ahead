CREATE TABLE `phase_to_scenario` (
	`phase_id` integer NOT NULL,
	`scenario_id` integer NOT NULL,
	PRIMARY KEY(`phase_id`, `scenario_id`),
	FOREIGN KEY (`phase_id`) REFERENCES `phases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`duration` integer
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE INDEX `phase_id_idx` ON `phase_to_scenario` (`phase_id`);--> statement-breakpoint
CREATE INDEX `scenario_id_idx` ON `phase_to_scenario` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `id_idx` ON `phases` (`id`);--> statement-breakpoint
CREATE INDEX `id_idx` ON `scenarios` (`id`);