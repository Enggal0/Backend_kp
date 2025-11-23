import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';

const seedExecutive = async () => {
  try {
    // Get PDM (Dinas Pendidikan Muda) as default unit for EXECUTIVE
    const pdm = await prisma.school.findFirst({
      where: { nama: 'PDM Sleman' }
    });

    if (!pdm) {
      console.log('  ⚠ PDM Sleman tidak ditemukan, skip seeding EXECUTIVE');
      return;
    }

    const encryptedPassword = bcrypt.hashSync('ABcd123!', 10);

    const executives = [
      {
        id: faker.string.uuid(),
        nama: 'Arifi Nugroho',
        nipm: '000003457891234567',
        email: 'arifi.nugroho@pdm.go.id',
        status_kepegawaian: 'Tetap',
        password: encryptedPassword,
        role: 'EXECUTIVE',
        unit_kerja_id: pdm.id,
      },
      {
        id: faker.string.uuid(),
        nama: 'Siti Rahayu',
        nipm: '000004568901234567',
        email: 'siti.rahayu@pdm.go.id',
        status_kepegawaian: 'Tetap',
        password: encryptedPassword,
        role: 'EXECUTIVE',
        unit_kerja_id: pdm.id,
      },
      {
        id: faker.string.uuid(),
        nama: 'Budi Handoko',
        nipm: '000005679012345678',
        email: 'budi.handoko@pdm.go.id',
        status_kepegawaian: 'Tetap',
        password: encryptedPassword,
        role: 'EXECUTIVE',
        unit_kerja_id: pdm.id,
      },
      // tambahan akun EXECUTIVE yang dapat digunakan untuk pengujian
      {
        id: faker.string.uuid(),
        nama: 'Executive Baru',
        nipm: '000009999999999999',
        email: 'executive.baru@pdm.go.id',
        status_kepegawaian: 'Tetap',
        password: encryptedPassword,
        role: 'EXECUTIVE',
        unit_kerja_id: pdm.id,
      },
    ];

    console.log(`  Menambahkan ${executives.length} akun EXECUTIVE...`);

    // Create executives, but skip if NIPM already exists to make seeding idempotent
    await Promise.all(
      executives.map(async (user) => {
        try {
          const existing = await prisma.user.findUnique({ where: { nipm: user.nipm } });
          if (existing) {
            console.log(`  - Skipping EXECUTIVE "${user.nama}" (NIPM: ${user.nipm}) — already exists`);
            return;
          }

          // Create user
          await prisma.user.create({
            data: user,
          });

          // Create profile if not exists
          const profileExists = await prisma.profile.findFirst({ where: { user_id: user.id } });
          if (!profileExists) {
            await prisma.profile.create({
              data: {
                id: faker.string.uuid(),
                user_id: user.id,
              },
            });
          }

          console.log(`  ✓ EXECUTIVE "${user.nama}" (NIPM: ${user.nipm}) berhasil ditambahkan`);
        } catch (error) {
          console.error(`  ✗ Gagal menambahkan EXECUTIVE "${user.nama}": ${error.message}`);
        }
      }),
    );

    console.log(`✓ Total ${executives.length} EXECUTIVE akun berhasil ditambahkan`);
  } catch (error) {
    console.error(`✗ Error dalam seedExecutive: ${error.message}`);
  }
};

export default seedExecutive;
