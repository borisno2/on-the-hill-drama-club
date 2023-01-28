-- AlterTable
ALTER TABLE `Account` ADD COLUMN `qboId` INTEGER NULL,
    ADD COLUMN `qboSyncToken` INTEGER NULL;

-- AlterTable
ALTER TABLE `LessonCategory` ADD COLUMN `qboItemId` INTEGER NULL;

-- CreateTable
CREATE TABLE `QuickBooksSettings` (
    `id` INTEGER NOT NULL,
    `realmId` VARCHAR(191) NOT NULL DEFAULT '',
    `accessToken` TEXT NULL,
    `refreshToken` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
