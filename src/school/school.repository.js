import axios from 'axios';
import prisma from '../config/database.js';

export const findAllSchools = async (schoolData) => {
   
  const skip = (schoolData.page - 1) * schoolData.size || 0;

  const filters = [];

  if (schoolData.nama) {
    filters.push({
      nama: {
        contains: schoolData.nama,
      },
    });
  }

  const schools = await prisma.school.findMany({
    where: {
      AND: filters,
    },
    orderBy: {
      nama: 'asc',
    },
    take: schoolData.size,
    skip,
  });

  const totalSchools = await prisma.school.count({
    where: {
      AND: filters,
    },
  });
  return {
    schools,
    page: schoolData.page,
    total_item: totalSchools,
    total_page: Math.ceil(totalSchools / schoolData.size),
  };
};

export const findSchoolById = async (id) => {
  const school = await prisma.school.findUnique({
    where: {
      id,
    },
  });
  return school;
};

export const insertSchool = async (schoolData) => {
  const school = await prisma.school.create({
    data: {
      npsn: schoolData.npsn,
      nama: schoolData.nama,
      jenjang: schoolData.jenjang,
      alamat: schoolData.alamat,
      kecamatan: schoolData.kecamatan,
      kelurahan: schoolData.kelurahan,
    },
  });
  return school;
};

export const editSchool = async (id, schoolData) => {
  const school = await prisma.school.update({
    where: {
      id,
    },
    data: {
      npsn: schoolData.npsn,
      nama: schoolData.nama,
      jenjang: schoolData.jenjang,
      alamat: schoolData.alamat,
      kecamatan: schoolData.kecamatan,
      kelurahan: schoolData.kelurahan,
    },
  });
  return school;
};

export const deleteSchool = async (id) => {
  const school = await prisma.school.delete({
    where: {
      id,
    },
  });
  return school;
};
