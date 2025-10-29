import prisma from '../src/config/database.js';
import seedAdmins from './seeders/adminPDM.seed.js';
import seedSchools from './seeders/school.seed.js';
import seedUsers from './seeders/users.seed.js';
import seedSchoolsPDM from './seeders/schoolPDM.seed.js';
// import seedUsersPDM from './seeders/adminPDM.seed.js';

async function main() {
  // await seedSchools(prisma);
  // await seedUsers(prisma);
  // await seedSchoolsPDM(prisma);
  await seedAdmins(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
