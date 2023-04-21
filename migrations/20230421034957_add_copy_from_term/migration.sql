-- AlterTable
ALTER TABLE `Term` ADD COLUMN `copyFrom` VARCHAR(191) NULL,
    ADD COLUMN `termStatus` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Term_copyFrom_idx` ON `Term`(`copyFrom`);
