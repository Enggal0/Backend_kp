import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';

const generateUsers = (schools) => {
  const encryptedPassword = bcrypt.hashSync('12345678', 10);
  const users = [];
  const school = faker.helpers.arrayElement(schools);
  for (let i = 0; i < 10; i++) {
    const user = {
      id: faker.string.uuid(),
      nama: faker.person.fullName(),
      nip: faker.string.numeric(18),
      status_kepegawaian: faker.helpers.arrayElement(['Tetap', 'Kontrak', 'Tidak_Tetap']),
      unit_kerja_id: school.id, // Sesuaikan dengan jumlah sekolah yang telah dibuat
      password: encryptedPassword,
    };
    users.push(user);
  }
  return users;
};

const seedUsers = async () => {
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
              jenis_kelamin: faker.helpers.arrayElement(['Laki_Laki', 'Perempuan']),
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

export default seedUsers;
