-- This is your Prisma schema file,
-- learn more about it in the docs: https://pris.ly/d/prisma-schema

-- Enums
CREATE TABLE `ENUM_Role` (
  `name` ENUM('admin', 'user') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Status_Kepegawaian` (
  `name` ENUM('Pegawai Tidak Tetap', 'Pegawai Tetap', 'Pegawai Kontrak') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Gender` (
  `name` ENUM('Laki-Laki', 'Perempuan') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Religion` (
  `name` ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Blood` (
  `name` ENUM('A', 'B', 'O', 'AB') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Status` (
  `name` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Relationship` (
  `name` ENUM('Anak', 'Istri', 'Suami') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Predikat` (
  `name` ENUM('A', 'AB', 'B', 'BC', 'C', 'D', 'E') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `ENUM_Dokumen` (
  `name` ENUM('KTP', 'NBM', 'Paspor', 'Kartu Keluarga', 'NUPTK', 'NPWP', 'BPJS') NOT NULL
) ENGINE=InnoDB;

-- CreateTable
CREATE TABLE `schools` (
    `id` VARCHAR(191) NOT NULL,
    `npsn` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jenjang` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `provinsi` VARCHAR(100) NOT NULL DEFAULT 'DI YOGYAKARTA',
    `kabupaten_kota` VARCHAR(100) NOT NULL DEFAULT 'KABUPATEN SLEMAN',
    `kecamatan` VARCHAR(100) NOT NULL,
    `kelurahan` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `nipm` VARCHAR(18) NOT NULL,
    `status_kepegawaian` ENUM('Pegawai Tidak Tetap', 'Pegawai Tetap', 'Pegawai Kontrak') NOT NULL,
    `email` VARCHAR(100) NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `token` TEXT NULL,
    `img_url` TEXT NULL,
    `unit_kerja_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_nipm_key`(`nipm`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `nipm` VARCHAR(18) NOT NULL,
    `status_kepegawaian` ENUM('Pegawai Tidak Tetap', 'Pegawai Tetap', 'Pegawai Kontrak') NOT NULL,
    `email` VARCHAR(100) NULL,
    `img_url` TEXT NULL,
    `unit_kerja_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `staff_nipm_key`(`nipm`),
    UNIQUE INDEX `staff_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `gelar_depan` VARCHAR(100) NULL,
    `gelar_belakang` VARCHAR(100) NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` VARCHAR(100) NULL,
    `jenis_kelamin` ENUM('Laki-Laki', 'Perempuan') NULL,
    `agama` ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu') NULL,
    `golongan_darah` ENUM('A', 'B', 'O', 'AB') NULL,
    `nomor_telepon` VARCHAR(100) NULL,
    `alamat` TEXT NULL,
    `provinsi` VARCHAR(100) NULL,
    `kabupaten_kota` VARCHAR(100) NULL,
    `kecamatan` VARCHAR(100) NULL,
    `kelurahan` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` VARCHAR(191) NOT NULL,
    `no_sk` VARCHAR(100) NOT NULL,
    `tanggal_sk` DATE NOT NULL,
    `tmt` DATE NOT NULL,
    `jenis_sk` VARCHAR(100) NOT NULL,
    `gaji_pokok` INTEGER NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educations` (
    `id` VARCHAR(191) NOT NULL,
    `jenjang` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jurusan` VARCHAR(100) NOT NULL,
    `tahun_lulus` YEAR NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trainings` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `penyelenggara` VARCHAR(100) NOT NULL,
    `jpl` INTEGER NOT NULL,
    `tahun_kegiatan` YEAR NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `titles` (
    `id` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(100) NOT NULL,
    `unit_kerja` VARCHAR(100) NOT NULL,
    `tmt` DATE NOT NULL,
    `tanggal_berakhir` DATE NOT NULL,
    `no_sk` VARCHAR(100) NOT NULL,
    `tanggal_sk` DATE NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `families` (
    `id` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(16) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `tempat` VARCHAR(100) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `jenis_kelamin` ENUM('Laki-Laki', 'Perempuan') NOT NULL,
    `agama` ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu') NOT NULL,
    `file_url` TEXT NOT NULL,
    `hubungan_kel` ENUM('Anak', 'Istri', 'Suami') NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievements` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `tingkat` VARCHAR(100) NOT NULL,
    `tahun` YEAR NOT NULL,
    `penyelenggara` VARCHAR(100) NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `performances` (
    `id` VARCHAR(191) NOT NULL,
    `nilai_kerja` INTEGER NOT NULL,
    `predikat` ENUM('A', 'AB', 'B', 'BC', 'C', 'D', 'E') NOT NULL,
    `tahun` YEAR NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `jenis_dokumen` ENUM('KTP', 'NBM', 'Paspor', 'Kartu Keluarga', 'NUPTK', 'NPWP', 'BPJS') NOT NULL,
    `no_dokumen` VARCHAR(100) NOT NULL,
    `file_url` TEXT NOT NULL,
    `status_verifikasi` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `alasan_ditolak` VARCHAR(100) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_unit_kerja_id_fkey` FOREIGN KEY (`unit_kerja_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_unit_kerja_id_fkey` FOREIGN KEY (`unit_kerja_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `educations` ADD CONSTRAINT `educations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `titles` ADD CONSTRAINT `titles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `families` ADD CONSTRAINT `families_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `achievements` ADD CONSTRAINT `achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `performances` ADD CONSTRAINT `performances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
