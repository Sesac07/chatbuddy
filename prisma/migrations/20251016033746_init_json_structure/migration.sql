-- CreateTable
CREATE TABLE `consultations` (
    `consultation_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'active',
    `solution_summary` JSON NULL,
    `messages` JSON NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `completed_at` TIMESTAMP(0) NULL,

    INDEX `idx_user_created`(`user_id`, `created_at` DESC),
    PRIMARY KEY (`consultation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `oauth_provider` VARCHAR(20) NOT NULL,
    `oauth_id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NULL,
    `nickname` VARCHAR(100) NULL,
    `profile_image` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_login_at` TIMESTAMP(0) NULL,

    INDEX `idx_email`(`email`),
    UNIQUE INDEX `unique_oauth`(`oauth_provider`, `oauth_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
