import path from 'path';
import { findUserById } from '../user/user.repository.js';
import ResponseError from '../utils/response-error.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import {
  createEducationValidation,
  getEducationValidation,
  updateEducationValidation,
} from '../validation/education-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deleteEducation,
  editEducation,
  findAllEducation,
  findAllEducationByUser,
  findEducationById,
  insertEducation,
  verificationEducation,
} from './education.repository.js';

// admin role
export const getAllEducation = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const educations = await findAllEducation(userId);

  return educations;
};

export const verifEducation = async (id, educationData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const educationById = await findEducationById(id, userId);

  if (!educationById) {
    throw new ResponseError(404, 'Education not found');
  }
  const eduVerifValidation = await validate(verifValidation, educationData);

  if (eduVerifValidation.status_verifikasi === 'accepted') {
    eduVerifValidation.alasan_ditolak = null;
  }

  const educationVerif = await verificationEducation(id, eduVerifValidation, userId);

  return educationVerif;
};

// user role
export const getAllEducationByUser = async (userId) => {
  const educations = await findAllEducationByUser(userId);

  return educations;
};

export const getEducationById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const education = await findEducationById(id, userId);

  if (!education) {
    throw new ResponseError(404, 'Education not found.');
  }

  return education;
};

export const createEducation = async (educationData, userId, file) => {
  const educationValidation = await validate(createEducationValidation, educationData);

  if (educationValidation.file) {
    educationValidation.file = educationValidation.file.replace(/\\/g, '/');
  }

  const education = await insertEducation(educationValidation, userId);

  return education;
};

export const updateEducation = async (id, educationData, userId) => {
  const educationId = await validate(getEducationValidation, id);
  const educationValidation = await validate(updateEducationValidation, educationData);
  const educationById = await findEducationById(educationId, userId);

  if (!educationById) {
    throw new ResponseError(404, 'Education not found.');
  }

  if (educationValidation.file) {
    educationValidation.file = educationValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!educationData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    educationValidation.file = educationById.file_url;
  } else if (educationById.file_url !== educationData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(educationById.file_url));
    fileDelete(filePath);
  }

  const education = await editEducation(educationId, educationValidation, userId);

  return education;
};

export const deleteEducationById = async (id, userId) => {
  const deleteValidation = await validate(getEducationValidation, id);
  const educationById = await findEducationById(deleteValidation, userId);

  if (!educationById) {
    throw new ResponseError(404, 'Education not found');
  }
  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(educationById.file_url));

  // Hapus file
  fileDelete(filePath);

  const education = await deleteEducation(deleteValidation);

  return education;
};
