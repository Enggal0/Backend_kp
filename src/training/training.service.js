import path from 'path';
import { findUserById } from '../user/user.repository.js';
import ResponseError from '../utils/response-error.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import {
  createTrainingValidation,
  getTrainingValidation,
  updateTrainingValidation,
} from '../validation/training-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deleteTraining,
  editTraining,
  findAllTraining,
  findAllTrainingByUser,
  findTrainingById, insertTraining,
  verificationTraining,
} from './training.repository.js';

// admin role

export const getAllTrainings = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const titles = await findAllTraining(userId);

  return titles;
};

export const verifTraining = async (id, trainingData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const trainingById = await findTrainingById(id, userId);

  if (!trainingById) {
    throw new ResponseError(404, 'Training not found');
  }
  const trainingVerifValidation = await validate(verifValidation, trainingData);

  if (trainingVerifValidation.status_verifikasi === 'accepted') {
    trainingVerifValidation.alasan_ditolak = null;
  }

  const trainingVerif = await verificationTraining(id, trainingVerifValidation, userId);

  return trainingVerif;
};

// user role

export const getAllTrainingsByUser = async (userId) => {
  const trainings = await findAllTrainingByUser(userId);

  return trainings;
};

export const getTrainingById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const trainingValidation = await validate(getTrainingValidation, id);
  const training = await findTrainingById(trainingValidation, userId);

  if (!training) {
    throw new ResponseError(404, 'Training not found.');
  }

  return training;
};

export const createTraining = async (trainingData, userId) => {
  const trainingValidation = await validate(createTrainingValidation, trainingData);

  if (trainingValidation.file) {
    trainingValidation.file = trainingValidation.file.replace(/\\/g, '/');
  }

  const training = await insertTraining(trainingValidation, userId);

  return training;
};

export const updateTraining = async (id, trainingData, userId) => {
  const trainingId = await validate(getTrainingValidation, id);
  const trainingValidation = await validate(updateTrainingValidation, trainingData);
  const trainingById = await findTrainingById(trainingId, userId);

  if (!trainingById) {
    throw new ResponseError(404, 'Training not found.');
  }

  if (trainingValidation.file) {
    trainingValidation.file = trainingValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!trainingData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    trainingValidation.file = trainingById.file_url;
  } else if (trainingById.file_url !== trainingData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(trainingById.file_url));
    fileDelete(filePath);
  }

  const training = await editTraining(trainingId, trainingValidation, userId);

  return training;
};

export const deleteTrainingById = async (id, userId) => {
  const trainingValidation = await validate(getTrainingValidation, id);
  const trainingById = await getTrainingById(trainingValidation, userId);

  if (!trainingById) {
    throw new ResponseError(404, 'Training not found.');
  }

  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(trainingById.file_url));

  // Hapus file
  fileDelete(filePath);

  const training = await deleteTraining(trainingValidation);
  return training;
};
