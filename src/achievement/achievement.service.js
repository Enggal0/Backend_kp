/* eslint-disable no-underscore-dangle */
import path from 'path';
import { findUserById } from '../user/user.repository.js';
import ResponseError from '../utils/response-error.js';
import { fileDelete } from '../utils/upload-file.js';
import {
  createAchievementValidation,
  getAchievementValidation,
  updateAchievementValidation,
} from '../validation/achievement-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deleteAchievement,
  editAchievement,
  findAchievementById,
  findAllAchievements,
  findAllAchievementsByUser,
  insertAchievement,
  verificationAchievement,
} from './achievement.repository.js';

// admin role

export const getAllAchievements = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const achievements = await findAllAchievements(userId);
  return achievements;
};

export const verifAchievement = async (id, achievementData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const achievementById = await findAchievementById(id, userId);

  if (!achievementById) {
    throw new ResponseError(404, 'Achievement not found');
  }
  const achievVerifValidation = await validate(verifValidation, achievementData);

  if (achievVerifValidation.status_verifikasi === 'accepted') {
    achievVerifValidation.alasan_ditolak = null;
  }
  const achievementVerif = await verificationAchievement(id, achievVerifValidation, userId);

  return achievementVerif;
};

// user role
export const getAllAchievementsByUser = async (userId) => {
  const achievements = await findAllAchievementsByUser(userId);
  return achievements;
};

export const getAchievementById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const achievementValidation = await validate(getAchievementValidation, id);
  const achievement = await findAchievementById(achievementValidation, userId);

  if (!achievement) {
    throw new ResponseError(404, 'Achivement not found.');
  }

  return achievement;
};

export const createAchievement = async (achievementData, userId) => {
  const achievementValidation = await validate(createAchievementValidation, achievementData);
  if (achievementValidation.file) {
    achievementValidation.file = achievementValidation.file.replace(/\\/g, '/');
  }
  const achievement = await insertAchievement(achievementValidation, userId);
  return achievement;
};

export const updateAchievement = async (id, achievementData, userId) => {
  const achievementId = await validate(getAchievementValidation, id);
  const achievementValidation = await validate(updateAchievementValidation, achievementData);
  const achievementById = await findAchievementById(achievementId, userId);

  if (!achievementById) {
    throw new ResponseError(404, 'Achievement not found.');
  }

  if (achievementValidation.file) {
    achievementValidation.file = achievementValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!achievementData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    achievementValidation.file = achievementById.file_url;
  } else if (achievementById.file_url !== achievementData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(achievementById.file_url));
    fileDelete(filePath);
  }

  const achievement = await editAchievement(achievementId, achievementValidation, userId);

  return achievement;
};

export const deleteAchievementById = async (id, userId) => {
  const achievementById = await getAchievementById(id, userId);

  if (!achievementById) {
    throw new ResponseError(404, 'Achievement not found.');
  }

  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(achievementById.file_url));

  // Hapus file
  fileDelete(filePath);
  const achievement = await deleteAchievement(id, userId);
  return achievement;
};
