/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("User_role")`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SUPERADMIN', 'CUSTOMER') NOT NULL;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('OWNER', 'ADMIN', 'USER') NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `userId` INTEGER,
    `invitedName` VARCHAR(191),
    `invitedEmail` VARCHAR(191),

    UNIQUE INDEX `Membership.organizationId_invitedEmail_unique`(`organizationId`, `invitedEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
