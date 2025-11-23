/*
  Warnings:

  - The values [admin] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `staff` ADD COLUMN `jenis_jabatan` ENUM('KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'STAF', 'LAINNYA') NULL DEFAULT 'GURU',
    ADD COLUMN `tahun_jabatan_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `titles` ADD COLUMN `type` ENUM('KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH', 'BENDAHARA', 'LAINNYA') NOT NULL DEFAULT 'LAINNYA';

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('super_admin', 'school_admin', 'executive', 'user') NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `terms` (
    `id` VARCHAR(191) NOT NULL,
    `start_year` YEAR NOT NULL,
    `end_year` YEAR NOT NULL,
    `title_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `terms_title_id_key`(`title_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahun_jabatan` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `mulai` DATE NOT NULL,
    `selesai` DATE NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_tahun_jabatan_id_fkey` FOREIGN KEY (`tahun_jabatan_id`) REFERENCES `tahun_jabatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `terms` ADD CONSTRAINT `terms_title_id_fkey` FOREIGN KEY (`title_id`) REFERENCES `titles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
