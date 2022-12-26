/*
  Warnings:

  - You are about to alter the column `amount` on the `BillItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(18,2)`.
  - You are about to alter the column `cost` on the `Class` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE `BillItem` MODIFY `amount` DECIMAL(18, 2) NULL;

-- AlterTable
ALTER TABLE `Class` MODIFY `cost` DECIMAL(18, 2) NULL;
