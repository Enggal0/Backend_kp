import path from 'path';
import {
  createPerformanceValidation,
  getPerformanceValidation, updatePerformanceValidation,
} from '../validation/performance-validation.js';
import ResponseError from '../utils/response-error.js';
import validate from '../validation/validation.js';
import {
  deletePerformance,
  editPerformance,
  findAllPerformances,
  findAllPerformancesByUser,
  findPerformanceById,
  insertPerformance,
  verificationPerformance,
} from './performance.repository.js';
import { findUserById } from '../user/user.repository.js';
import verifValidation from '../validation/verification-validation.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';

// admin role

export const getAllPerformances = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const performances = await findAllPerformances(userId);
  return performances;
};

export const verifPerformance = async (id, performanceData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const performanceById = await findPerformanceById(id, userId);

  if (!performanceById) {
    throw new ResponseError(404, 'Performance not found');
  }
  const performVerifValidation = await validate(verifValidation, performanceData);

  if (performVerifValidation.status_verifikasi === 'accepted') {
    performVerifValidation.alasan_ditolak = null;
  }

  const performanceVerif = await verificationPerformance(id, performVerifValidation, userId);

  return performanceVerif;
};

// user role

export const getAllPerformancesByUser = async (userId) => {
  const performances = await findAllPerformancesByUser(userId);
  return performances;
};

export const getPerformanceById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const perfomanceId = await validate(getPerformanceValidation, id);
  const performance = await findPerformanceById(perfomanceId, userId);
  if (!performance) {
    throw new ResponseError(404, 'Performance not found');
  }
  return performance;
};

export const createPerformance = async (performanceData, userId) => {
  const performanceValidation = validate(createPerformanceValidation, performanceData);
  if (performanceValidation.file) {
    performanceValidation.file = performanceValidation.file.replace(/\\/g, '/');
  }
  const performance = await insertPerformance(performanceValidation, userId);
  return performance;
};

export const updatePerformance = async (id, performanceData, userId) => {
  const perfomanceId = validate(getPerformanceValidation, id);

  const performanceValidation = validate(updatePerformanceValidation, performanceData);

  if (performanceValidation.file) {
    performanceValidation.file = performanceValidation.file.replace(/\\/g, '/');
  }

  const performanceById = await findPerformanceById(perfomanceId, userId);
  if (!performanceById) {
    throw new ResponseError(404, 'Performances not found.');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!performanceData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    performanceValidation.file = performanceById.file_url;
  } else if (performanceById.file_url !== performanceData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(performanceById.file_url));
    fileDelete(filePath);
  }

  const performance = await editPerformance(perfomanceId, performanceValidation, userId);
  return performance;
};

export const deletePerformanceById = async (id, userId) => {
  const performanceById = await findPerformanceById(id);
  if (!performanceById) {
    throw new ResponseError(404, 'Performances not found.');
  }

  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(performanceById.file_url));

  // Hapus file
  fileDelete(filePath);
  const performance = await deletePerformance(id, userId);
  return performance;
};
