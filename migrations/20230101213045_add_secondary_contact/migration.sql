-- AlterTable
ALTER TABLE `Account` ADD COLUMN `secondContactName` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    ADD COLUMN `secondContactPhone` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `surname` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `phone` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `streetAddress` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `suburb` VARCHAR(191) NOT NULL DEFAULT 'PLEASE_UPDATE',
    MODIFY `postcode` INTEGER NOT NULL DEFAULT 3550;
