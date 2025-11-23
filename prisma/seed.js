import prisma from '../src/config/database.js';
import seedAdmins from './seeders/adminPDM.seed.js';
import seedSchools from './seeders/school.seed.js';
import seedUsers from './seeders/users.seed.js';
import seedSchoolsPDM from './seeders/schoolPDM.seed.js';
import seedExecutive from './seeders/executive.seed.js';

async function main() {
  console.log('Starting seed process...');
  
  console.log('1. Seeding PDM schools...');
  await seedSchoolsPDM(prisma);

  console.log('2. Seeding regular schools...');
  await seedSchools(prisma);

  console.log('3. Seeding admins...');
  await seedAdmins(prisma);

  console.log('4. Seeding executives...');
  await seedExecutive(prisma);

  console.log('5. Seeding regular users...');
  await seedUsers(prisma);
  
  console.log('✓ All seed operations completed!');
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
