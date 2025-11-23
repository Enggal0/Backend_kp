/*
  Warnings:

  - You are about to drop the column `email` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `nipm` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_jabatan_id` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `tahun_jabatan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `staff` DROP FOREIGN KEY `staff_tahun_jabatan_id_fkey`;

-- DropIndex
DROP INDEX `staff_email_key` ON `staff`;

-- DropIndex
DROP INDEX `staff_nipm_key` ON `staff`;

-- AlterTable
ALTER TABLE `staff` DROP COLUMN `email`,
    DROP COLUMN `img_url`,
    DROP COLUMN `nama`,
    DROP COLUMN `nipm`,
    DROP COLUMN `tahun_jabatan_id`,
    ADD COLUMN `tahun_jabatan_mulai` DATETIME(3) NULL,
    ADD COLUMN `tahun_jabatan_selesai` DATETIME(3) NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `status_kepegawaian` ENUM('Pegawai Tidak Tetap', 'Pegawai Tetap', 'Pegawai Kontrak') NULL,
    MODIFY `createdByUserId` VARCHAR(191) NULL,
    MODIFY `jenis_jabatan` ENUM('KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'STAF', 'ADMIN', 'LAINNYA') NULL DEFAULT 'GURU';

-- AlterTable
ALTER TABLE `users` MODIFY `status_kepegawaian` ENUM('Pegawai Tidak Tetap', 'Pegawai Tetap', 'Pegawai Kontrak') NULL,
    MODIFY `unit_kerja_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `tahun_jabatan`;

-- CreateIndex
CREATE UNIQUE INDEX `staff_user_id_key` ON `staff`(`user_id`);

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
