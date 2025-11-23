import { faker } from '@faker-js/faker';
import axios from 'axios';
import prisma from '../../src/config/database.js';
// eslint-disable-next-line import/extensions
import dataSekolah from './DataSekolah.js';

// const generateSchools = async () => {
//   const schools = [];
//   const kec = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/districts/3404.json');
//   const district = kec.data;
//   const kecamatan = district.find((districts) => districts.name);

//   const villages = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatan.id}.json`);
//   const village = villages.data;
//   const kelurahan = village.find((f) => f.name);

//   for (let i = 0; i < 20; i++) {
//     const school = {
//       npsn: faker.string.numeric(8),
//       nama: `${faker.helpers.arrayElement(['SD', 'SMP', 'SMA'])} ${faker.string.numeric({ length: { max: 3 } })} Muhammadiyah Sleman`,
//       jenjang: faker.helpers.arrayElement(['SD', 'SMP', 'SMA']),
//       alamat: faker.location.street(),
//       provinsi: 'DI YOGYAKARTA',
//       kabupaten_kota: 'KABUPATEN SLEMAN',
//       kecamatan: kecamatan.name,
//       kelurahan: kelurahan.name,
//     };
//     schools.push(school);
//   }
//   return schools;
// };

const generateSchools = async () => {
  const schools = dataSekolah.map((school) => ({
    id: school.id,
    npsn: school.npsn,
    nama: school.nama,
    jenjang: school.jenjang,
    alamat: school.alamat,
    provinsi: school.provinsi,
    kabupaten_kota: school.kabupaten,
    kecamatan: school.kecamatan,
    kelurahan: school.Kelurahan,
  }));
  return schools;
};

const seedSchools = async () => {
  try {
    const schools = await generateSchools();
    await Promise.all(
      schools.map(async (school) => {
        try {
          await prisma.school.create({
            data: school,
          });
          console.log(`  ✓ Sekolah "${school.nama}" ditambahkan`);
        } catch (error) {
          console.error(`  ✗ Gagal menambahkan sekolah "${school.nama}": ${error.message}`);
        }
      }),
    );
    console.log(`✓ Total ${schools.length} sekolah dari DataSekolah berhasil ditambahkan`);
  } catch (error) {
    console.error(`✗ Error dalam seedSchools: ${error.message}`);
  }
};

export default seedSchools;
