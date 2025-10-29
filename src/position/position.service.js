import path from 'path';
import { findUserById } from '../user/user.repository.js';
import { formatDate, validDate } from '../utils/date-format.js';
import ResponseError from '../utils/response-error.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import {
  createPositionValidation,
  getPositionValidation,
  updatePositionValidation,
} from '../validation/position-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deletePositionById,
  findAllPositions,
  findAllPositionsByUser,
  findPositionById,
  insertPosition,
  updatePositionById,
  verificationPosition,
} from './position.repository.js';

// admin role

export const getAllPositions = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const positions = await findAllPositions(userId);
  // Date Format on several attributes
  const formattedPositions = positions.map((position) => ({
    ...position,
    tanggal_sk: formatDate(position.tanggal_sk),
    tmt: formatDate(position.tmt),
  }));

  return formattedPositions;
};

export const getPositionById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }

  const positionId = await validate(getPositionValidation, id);
  const position = await findPositionById(positionId, userId);
  if (!position) {
    throw new ResponseError(404, 'Position not found');
  }
  return {
    ...position,
    tanggal_sk: formatDate(position.tanggal_sk),
    tmt: formatDate(position.tmt),
  };
};

export const verifPosition = async (id, positionData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const positionById = await findPositionById(id, userId);

  if (!positionById) {
    throw new ResponseError(404, 'Position not found');
  }
  const positionVerifValidation = await validate(verifValidation, positionData);

  if (positionVerifValidation.status_verifikasi === 'accepted') {
    positionVerifValidation.alasan_ditolak = null;
  }

  const positionVerif = await verificationPosition(id, positionVerifValidation, userId);

  return positionVerif;
};

// user role

export const getAllPositionsByUser = async (userId) => {
  const positions = await findAllPositionsByUser(userId);

  // Date Format on several attributes
  const formattedPositions = positions.map((position) => ({
    ...position,
    tanggal_sk: formatDate(position.tanggal_sk),
    tmt: formatDate(position.tmt),
  }));

  return formattedPositions;
};

export const createPosition = async (positionData, userId, file) => {
  const positionValidation = await validate(createPositionValidation, positionData);

  // Deklarasi valid Date
  const tanggalSK = validDate(positionData.tanggal_sk);
  const TMT = validDate(positionData.tmt);

  if (positionValidation.file) {
    positionValidation.file = positionValidation.file.replace(/\\/g, '/');
  }

  const position = await insertPosition(positionValidation, userId);

  return {
    id: position.id,
    no_sk: position.no_sk,
    tanggal_sk: formatDate(position.tanggal_sk),
    tmt: formatDate(position.tmt),
    jenis_sk: position.jenis_sk,
    gaji_pokok: position.gaji_pokok,
    file_url: position.file_url,
    user_id: position.user_id,
    status_verifikasi: position.status_verifikasi,
    alasan_ditolak: position.alasan_ditolak,
  };
};

export const updatePosition = async (id, positionData, userId) => {
  const positionValidation = await validate(updatePositionValidation, positionData);
  const positionId = validate(getPositionValidation, id);
  const positionById = await findPositionById(positionId, userId);
  if (!positionById) {
    throw new ResponseError(404, 'Position not found.');
  }

  if (positionValidation.file) {
    positionValidation.file = positionValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!positionData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    positionValidation.file = positionById.file_url;
  } else if (positionById.file_url !== positionData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(positionById.file_url));
    fileDelete(filePath);
  }

  const position = await updatePositionById(positionId, positionValidation, userId);

  return {
    id: position.id,
    no_sk: position.no_sk,
    tanggal_sk: formatDate(position.tanggal_sk),
    tmt: formatDate(position.tmt),
    jenis_sk: position.jenis_sk,
    gaji_pokok: position.gaji_pokok,
    file_url: position.file_url,
    user_id: position.user_id,
    status_verifikasi: position.status_verifikasi,
    alasan_ditolak: position.alasan_ditolak,
  };
};

export const deletePosition = async (id, userId) => {
  const positionValidation = await validate(getPositionValidation, id);

  const positionById = await findPositionById(positionValidation, userId);

  if (!positionById) {
    throw new ResponseError(404, 'Position not found.');
  }
  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(positionById.file_url));

  // Hapus file
  fileDelete(filePath);

  const position = await deletePositionById(positionValidation, userId);

  return position;
};
