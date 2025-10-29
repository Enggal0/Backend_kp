import prisma from '../config/database.js';

export const findAllAchievements = async (userId) => {
  const achievements = await prisma.achievement.findMany({
    where: {
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
  });
  return achievements;
};

export const findAllAchievementsByUser = async (userId) => {
  const achievements = await prisma.achievement.findMany({
    where: {
      user_id: userId,
    },
  });
  return achievements;
};

export const findAchievementById = async (id, userId) => {
  const achievement = await prisma.achievement.findUnique({
    where: {
      id,
      user_id: userId,
    },
  });
  return achievement;
};

export const insertAchievement = async (achievementData, userId) => {
  const achievement = await prisma.achievement.create({
    data: {
      nama: achievementData.nama,
      tingkat: achievementData.tingkat,
      tahun: achievementData.tahun,
      penyelenggara: achievementData.penyelenggara,
      file_url: achievementData.file,
      user_id: userId,
    },
  });
  return achievement;
};

export const editAchievement = async (id, achievementData, userId) => {
  const achievement = await prisma.achievement.update({
    where: {
      id,
      user_id: userId,
    },
    data: {
      nama: achievementData.nama,
      tingkat: achievementData.tingkat,
      tahun: achievementData.tahun,
      penyelenggara: achievementData.penyelenggara,
      file_url: achievementData.file,
    },
  });
  return achievement;
};

export const deleteAchievement = async (id, userId) => {
  const achievement = await prisma.achievement.delete({
    where: {
      id,
      user_id: userId,
    },
  });
  return achievement;
};

export const verificationAchievement = async (id, achievementData, userId) => {
  const verifAchievement = await prisma.achievement.update({
    where: {
      id,
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
    data: {
      status_verifikasi: achievementData.status_verifikasi,
      alasan_ditolak: achievementData.alasan_ditolak,
    },
  });
  return verifAchievement;
};
