/*
  Warnings:

  - You are about to alter the column `status` on the `Enrolment` table. The data in that column could be lost. The data in that column will be cast from `Enum("Enrolment_status")` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Enrolment` MODIFY `status` VARCHAR(191) NOT NULL;
