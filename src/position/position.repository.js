import prisma from '../config/database.js';

export const findAllPositions = async (userId) => {
  const positions = await prisma.position.findMany({
    where: {
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
  });

  return positions;
};
export const findAllPositionsByUser = async (userId) => {
  const positions = await prisma.position.findMany({
    where: {
      user_id: userId,
    },
  });

  return positions;
};

export const insertPosition = async (positionData, userId) => {
  const position = await prisma.position.create({
    data: {
      no_sk: positionData.no_sk,
      tanggal_sk: positionData.tanggal_sk,
      tmt: positionData.tmt,
      jenis_sk: positionData.jenis_sk,
      gaji_pokok: positionData.gaji_pokok,
      file_url: positionData.file,
      user_id: userId,
    },
  });

  return position;
};

export const findPositionById = async (id, userId) => {
  const position = await prisma.position.findUnique({
    where: {
      id,
      user_id: userId,
    },
  });

  return position;
};

export const updatePositionById = async (id, positionData, userId) => {
  const position = await prisma.position.update({
    where: {
      id,
      user_id: userId,
    },
    data: {
      no_sk: positionData.no_sk,
      tanggal_sk: positionData.tanggal_sk,
      tmt: positionData.tmt,
      jenis_sk: positionData.jenis_sk,
      gaji_pokok: positionData.gaji_pokok,
      file_url: positionData.file,
    },
  });

  return position;
};

export const deletePositionById = async (id, userId) => {
  const position = await prisma.position.delete({
    where: {
      id,
      user_id: userId,
    },
  });

  return position;
};

export const verificationPosition = async (id, positionData, userId) => {
  const verifPosition = await prisma.position.update({
    where: {
      id,
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
    data: {
      status_verifikasi: positionData.status_verifikasi,
      alasan_ditolak: positionData.alasan_ditolak,
    },
  });
  return verifPosition;
};
