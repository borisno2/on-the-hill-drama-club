-- CreateTable
CREATE TABLE `EmailSettings` (
    `id` INTEGER NOT NULL,
    `fromEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `enrolmentConfirmationTemplate` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
