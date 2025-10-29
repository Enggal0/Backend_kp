import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';
import dataAdmin from './DataAdminSekolah.js';

// const generateUsers = (schools) => {
//   const encryptedPassword = bcrypt.hashSync('12345678', 10);
//   const school = faker.helpers.arrayElement(schools);

//   const users = [
//     {
//       id: faker.string.uuid(),
//       nama: 'Admin 1',
//       nip: '112345678901234567',
//       status_kepegawaian: 'Tetap',
//       password: encryptedPassword,
//       role: 'ADMIN',
//       unit_kerja_id: school.id,
//     },
//     {
//       nama: 'Admin Dua',
//       nip: '234567890123456789',
//       status_kepegawaian: 'Tetap',
//       password: encryptedPassword,
//       role: 'ADMIN',
//       unit_kerja_id: school.id,
//     },
//     {
//       nama: 'Admin Tiga',
//       nip: '345678901234567890',
//       status_kepegawaian: 'Tetap',
//       password: encryptedPassword,
//       role: 'ADMIN',
//       unit_kerja_id: school.id,
//     },
//     {
//       nama: 'Admin Empat',
//       nip: '456789012345678901',
//       status_kepegawaian: 'Tetap',
//       password: encryptedPassword,
//       role: 'ADMIN',
//       unit_kerja_id: school.id,
//     },
//     {
//       nama: 'Admin Lima',
//       nip: '567890123456789012',
//       status_kepegawaian: 'Tetap',
//       password: encryptedPassword,
//       role: 'ADMIN',
//       unit_kerja_id: school.id,
//     },
//   ];
//   return users;
// };

const generateUsers = async () => {
  const admins = dataAdmin.map((user) => ({
    id: user.id,
    nama: user.nama,
    nipm: user.nipm,
    email: user.email,
    status_kepegawaian: user.status_kepegawaian,
    password: user.password,
    role: user.role,
    unit_kerja_id: user.unit_kerja_id,
  }));
  return admins;
};

const seedAdmins = async () => {
  try {
    const users = await generateUsers(); // Tunggu hasil generateUsers
    const userId = users.find((u) => u.id);
    // Proses user secara paralel
    await Promise.all(
      users.map(async (user) => {
        try {
          await prisma.user.create({
            data: {
              ...user,
              profile: {
                create: {
                  id: faker.string.uuid(),
                  user_id: userId[0], // Gunakan user.id yang valid
                },
              },
            },
          });
          console.log(`User "${user.nama}" berhasil ditambahkan.`);
        } catch (error) {
          console.error(`Gagal menambahkan user "${user.nama}": ${error.message}`);
        }
      }),
    );

    console.log('Proses seeding selesai.');
  } catch (error) {
    console.error(`Gagal menjalankan seeding: ${error.message}`);
  }
};

export default seedAdmins;
