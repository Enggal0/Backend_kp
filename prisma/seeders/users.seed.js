import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';

const generateUsers = (schools) => {
  const encryptedPassword = bcrypt.hashSync('12345678', 10);
  const users = [];
  
  // Create 10 users per school
  schools.forEach((school) => {
    for (let i = 0; i < 10; i++) {
      const user = {
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        nipm: faker.string.numeric(18),
        status_kepegawaian: faker.helpers.arrayElement(['Tetap', 'Kontrak', 'Tidak_Tetap']),
        role: 'USER',
        unit_kerja_id: school.id,
        password: encryptedPassword,
        email: faker.internet.email(),
      };
      users.push(user);
    }
  });
  
  return users;
};

const seedUsers = async () => {
  try {
    const schools = await prisma.school.findMany();
    
    // Compute an active masa jabatan range to attach to staff (no separate TahunJabatan table)
    const now = new Date();
    const year = now.getFullYear();
    const activeMulai = new Date(`${year - 1}-07-01`);
    const activeSelesai = new Date(`${year}-06-30`);
    
    // Fetch admins to use as createdBy
    const admins = await prisma.user.findMany({
      where: { role: 'SCHOOL_ADMIN' }
    });
    const adminMap = {}; // school_id -> admin_user_id
    admins.forEach(a => {
      adminMap[a.unit_kerja_id] = a.id;
    });

    // Also fetch SUPER_ADMIN for PDM schools if needed
    const superAdmins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' }
    });
    superAdmins.forEach(a => {
      adminMap[a.unit_kerja_id] = a.id;
    });

    const users = generateUsers(schools);
    console.log(`  Menambahkan ${users.length} user reguler dari semua sekolah...`);
    
    await Promise.all(
      users.map(async (user) => {
        try {
          // Buat user
          await prisma.user.create({
            data: {
              id: user.id,
              nama: user.nama,
              nipm: user.nipm,
              status_kepegawaian: user.status_kepegawaian,
              role: user.role,
              unit_kerja_id: user.unit_kerja_id,
              password: user.password,
              email: user.email,
            },
          });
          
          // Buat profile
          await prisma.profile.create({
            data: {
              id: faker.string.uuid(),
              user_id: user.id,
              jenis_kelamin: faker.helpers.arrayElement(['Laki_Laki', 'Perempuan']),
            },
          });

          // Create staff record linked to the user
          const creatorId = adminMap[user.unit_kerja_id];
          if (creatorId) {
            await prisma.staff.create({
              data: {
                user_id: user.id,
                unit_kerja_id: user.unit_kerja_id,
                createdByUserId: creatorId,
                jenis_jabatan: 'GURU',
                status_kepegawaian: user.status_kepegawaian,
                tahun_jabatan_mulai: activeMulai,
                tahun_jabatan_selesai: activeSelesai,
              }
            });
          }
          
          console.log(`  ✓ User "${user.nama}" ditambahkan`);
        } catch (error) {
          console.error(`  ✗ Gagal menambahkan user "${user.nama}": ${error.message}`);
        }
      }),
    );
    console.log(`✓ Total ${users.length} user reguler berhasil ditambahkan`);
  } catch (error) {
    console.error(`✗ Error dalam seedUsers: ${error.message}`);
  }
};

export default seedUsers;