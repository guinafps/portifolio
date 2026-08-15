ALTER TABLE `projects` ADD `show_project_link` integer DEFAULT false NOT NULL;
--> statement-breakpoint
UPDATE `site_settings`
SET `whatsapp` = 'https://wa.me/5567992227140?text=Ol%C3%A1%2C%20vim%20do%20seu%20portif%C3%B3lio!'
WHERE `id` = 1;
--> statement-breakpoint
PRAGMA optimize;
