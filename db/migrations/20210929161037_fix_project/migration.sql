/*
  Warnings:

  - Added the required column `organizationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `organizationId` INTEGER NOT NULL;
