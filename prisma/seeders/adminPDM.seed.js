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
  const admins = dataAdmin.map((user) => {
    let role = 'SCHOOL_ADMIN';
    // ID PDM Sleman
    if (user.unit_kerja_id === 'e0283480-eade-41b2-85a4-f54c3813e455') {
      role = 'SUPER_ADMIN';
    }

    return {
      id: user.id,
      nama: user.nama,
      nipm: user.nipm,
      email: user.email,
      status_kepegawaian: user.status_kepegawaian,
      password: user.password,
      role: role,
      unit_kerja_id: user.unit_kerja_id,
    };
  });
  return admins;
};

const seedAdmins = async () => {
  try {
    const users = await generateUsers();
    console.log(`  Menambahkan ${users.length} admin akun dari DataAdminSekolah...`);
    
    await Promise.all(
      users.map(async (user) => {
        try {
          // Buat user dulu
          await prisma.user.create({
            data: user,
          });
          
          // Buat profile terpisah
          await prisma.profile.create({
            data: {
              id: faker.string.uuid(),
              user_id: user.id,
            },
          });

          // Buat staff record untuk admin
          await prisma.staff.create({
            data: {
              user_id: user.id,
              unit_kerja_id: user.unit_kerja_id,
              jenis_jabatan: 'ADMIN',
              status_kepegawaian: user.status_kepegawaian,
            },
          });
          
          console.log(`  ✓ Admin "${user.nama}" berhasil ditambahkan`);
        } catch (error) {
          console.error(`  ✗ Gagal menambahkan admin "${user.nama}": ${error.message}`);
        }
      }),
    );
    console.log(`✓ Total ${users.length} admin akun berhasil ditambahkan`);
  } catch (error) {
    console.error(`✗ Error dalam seedAdmins: ${error.message}`);
  }
};

export default seedAdmins;
