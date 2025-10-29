import prisma from '../config/database.js';

export const findAllTitles = async (userId) => {
  const titles = await prisma.title.findMany({
    where: {
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
  });

  return titles;
};
export const findAllTitlesByUser = async (userId) => {
  const titles = await prisma.title.findMany({
    where: {
      user_id: userId,
    },
  });

  return titles;
};

export const findTitleById = async (id, userId) => {
  const title = await prisma.title.findUnique({
    where: {
      id,
      user_id: userId,
    },
  });
  return title;
};

export const insertTitle = async (titleData, userId) => {
  const title = await prisma.title.create({
    data: {
      jabatan: titleData.jabatan,
      unit_kerja: titleData.unit_kerja,
      tmt: titleData.tmt,
      tanggal_berakhir: titleData.tanggal_berakhir,
      no_sk: titleData.no_sk,
      tanggal_sk: titleData.tanggal_sk,
      file_url: titleData.file,
      user_id: userId,
    },
  });
  return title;
};

export const editTitle = async (id, titleData, userId) => {
  const title = await prisma.title.update({
    where: {
      id,
      user_id: userId,
    },
    data: {
      jabatan: titleData.jabatan,
      unit_kerja: titleData.unit_kerja,
      tmt: titleData.tmt,
      tanggal_berakhir: titleData.tanggal_berakhir,
      no_sk: titleData.no_sk,
      tanggal_sk: titleData.tanggal_sk,
      file_url: titleData.file,
    },
  });
  return title;
};

export const deleteTitle = async (id, userId) => {
  const title = await prisma.title.delete({
    where: {
      id,
      user_id: userId,
    },
  });
  return title;
};

export const verificationTitle = async (id, titleData, userId) => {
  const verifTitle = await prisma.title.update({
    where: {
      id,
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
    data: {
      status_verifikasi: titleData.status_verifikasi,
      alasan_ditolak: titleData.alasan_ditolak,
    },
  });
  return verifTitle;
};
