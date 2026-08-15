CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text NOT NULL,
	`description` text NOT NULL,
	`cover_image` text,
	`gallery` text DEFAULT '[]' NOT NULL,
	`technologies` text DEFAULT '[]' NOT NULL,
	`category` text NOT NULL,
	`project_date` text NOT NULL,
	`project_url` text,
	`github_url` text,
	`challenge` text DEFAULT '' NOT NULL,
	`solution` text DEFAULT '' NOT NULL,
	`result` text DEFAULT '' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_projects_slug` ON `projects` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_projects_published_featured` ON `projects` (`published`,`featured`);
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_project_images_project` ON `project_images` (`project_id`);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_contact_messages_status_created` ON `contact_messages` (`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_contact_messages_email_created` ON `contact_messages` (`email`,`created_at`);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period` text NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`description` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`name` text DEFAULT 'Seu Nome' NOT NULL,
	`headline` text DEFAULT 'Programador Freelancer' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`email` text DEFAULT 'ola@seudominio.com' NOT NULL,
	`github` text DEFAULT '#' NOT NULL,
	`linkedin` text DEFAULT '#' NOT NULL,
	`instagram` text DEFAULT '#' NOT NULL,
	`whatsapp` text DEFAULT '#' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `site_settings` (`id`,`name`,`headline`,`bio`,`email`,`github`,`linkedin`,`instagram`,`whatsapp`) VALUES (1,'Joao Pedro dos Santos','Programador Freelancer','Sou programador freelancer desde setembro de 2024. Crio scripts e mod menus em Lua para FiveM, bots para Discord, sites e aplicações, transformando ideias em soluções funcionais e feitas sob medida.','contato.jpsouzasantos@gmail.com','https://github.com/guinafps','','https://www.instagram.com/jpkku_/','');
--> statement-breakpoint
INSERT INTO `projects` (`title`,`slug`,`short_description`,`description`,`technologies`,`category`,`project_date`,`project_url`,`github_url`,`challenge`,`solution`,`result`,`featured`,`published`) VALUES
('Gerador Spotify','gerador-spotify','Experimento em Node.js para gerar identificadores aleatórios e exportar os resultados em um arquivo de texto.','Projeto de linha de comando que recebe a quantidade desejada, cria strings aleatórias com o módulo crypto do Node.js, monta URLs e salva a lista em um arquivo local.','["Node.js","JavaScript","Crypto","File System"]','Automação / CLI','2024',NULL,'https://github.com/guinafps/geradorspotify','Praticar a criação de uma ferramenta simples de terminal que valide entradas e gere vários resultados de forma automatizada.','O script usa crypto.randomInt para compor identificadores, readline para capturar a quantidade e fs para gravar a saída em um arquivo de texto.','Um protótipo compacto que reúne entrada via terminal, geração aleatória e persistência local em um único fluxo.',1,1);
--> statement-breakpoint
INSERT INTO `experiences` (`period`,`role`,`company`,`description`,`position`) VALUES
('SET 2024 — AGORA','Programador Freelancer','Autônomo','Scripts e mod menus em Lua para FiveM, bots para Discord, sites e aplicações desenvolvidos sob medida.',1);
--> statement-breakpoint
PRAGMA optimize;
