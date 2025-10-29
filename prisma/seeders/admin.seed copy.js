import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';

const generateUsers = (schools) => {
  const encryptedPassword = bcrypt.hashSync('12345678', 10);
  const school = faker.helpers.arrayElement(schools);

  const users = [
    {
      id: faker.string.uuid(),
      nama: 'Admin 1',
      nip: '112345678901234567',
      status_kepegawaian: 'Tetap',
      password: encryptedPassword,
      role: 'ADMIN',
      unit_kerja_id: school.id,
    },
    {
      nama: 'Admin Dua',
      nip: '234567890123456789',
      status_kepegawaian: 'Tetap',
      password: encryptedPassword,
      role: 'ADMIN',
      unit_kerja_id: school.id,
    },
    {
      nama: 'Admin Tiga',
      nip: '345678901234567890',
      status_kepegawaian: 'Tetap',
      password: encryptedPassword,
      role: 'ADMIN',
      unit_kerja_id: school.id,
    },
    {
      nama: 'Admin Empat',
      nip: '456789012345678901',
      status_kepegawaian: 'Tetap',
      password: encryptedPassword,
      role: 'ADMIN',
      unit_kerja_id: school.id,
    },
    {
      nama: 'Admin Lima',
      nip: '567890123456789012',
      status_kepegawaian: 'Tetap',
      password: encryptedPassword,
      role: 'ADMIN',
      unit_kerja_id: school.id,
    },
  ];
  return users;
};

const seedAdmins = async () => {
  const schools = await prisma.school.findMany();
  const users = generateUsers(schools);
  const userId = users.find((u) => u.id);
  users.forEach(async (user) => {
    try {
      await prisma.user.create({
        data: {
          ...user,
          profile: {
            create: {
              id: faker.string.uuid(),
              user_id: userId[0],
            },
          },
        },
      });

      console.log(`User "${user.nama}" berhasil ditambahkan.`);
    } catch (error) {
      console.error(`Gagal menambahkan user: ${error.message}`);
    }
  });
};

export default seedAdmins;
