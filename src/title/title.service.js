import path from 'path';
import { findUserById } from '../user/user.repository.js';
import { formatDate, validDate } from '../utils/date-format.js';
import ResponseError from '../utils/response-error.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import { createTitleValidation, getTitleValidation, updateTitleValidation } from '../validation/title-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deleteTitle,
  editTitle,
  findAllTitles,
  findAllTitlesByUser,
  findTitleById,
  insertTitle,
  verificationTitle,
} from './title.repository.js';

// admin role

const getAllTitles = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const titles = await findAllTitles(userId);
  const allTitles = titles.map((title) => ({
    ...title,
    tanggal_sk: formatDate(title.tanggal_sk),
    tanggal_berakhir: formatDate(title.tanggal_berakhir),
    tmt: formatDate(title.tmt),
  }));

  return allTitles;
};

const getTitleById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const title = await findTitleById(id, userId);
  if (!title) {
    throw new ResponseError(404, 'Title not found.');
  }

  return {
    ...title,
    tanggal_sk: formatDate(title.tanggal_sk),
    tanggal_berakhir: formatDate(title.tanggal_berakhir),
    tmt: formatDate(title.tmt),
  };
};

const verifTitle = async (id, titleData, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const titleById = await findTitleById(id, userId);

  if (!titleById) {
    throw new ResponseError(404, 'Title not found');
  }
  const titleVerifValidation = await validate(verifValidation, titleData);

  if (titleVerifValidation.status_verifikasi === 'accepted') {
    titleVerifValidation.alasan_ditolak = null;
  }

  const titleVerif = await verificationTitle(id, titleVerifValidation, userId);

  return titleVerif;
};

// user role

const getAllTitlesByUser = async (userId) => {
  const titles = await findAllTitlesByUser(userId);

  // Date Format on several attributes
  const formattedTitles = titles.map((title) => ({
    ...title,
    tmt: formatDate(title.tmt),
    tanggal_berakhir: formatDate(title.tanggal_berakhir),
    tanggal_sk: formatDate(title.tanggal_sk),
  }));

  return formattedTitles;
};

const createTitle = async (titleData, userId) => {
  const titleValidation = await validate(createTitleValidation, titleData);
  if (titleValidation.file) {
    titleValidation.file = titleValidation.file.replace(/\\/g, '/');
  }

  const TMT = validDate(titleData.tmt);
  const tanggalSK = validDate(titleData.tanggal_sk);
  const tanggalBerakhir = validDate(titleData.tanggal_berakhir);
  const title = await insertTitle(titleValidation, userId);

  return {
    id: title.id,
    jabatan: title.jabatan,
    unit_kerja: title.unit_kerja,
    tmt: formatDate(TMT),
    tanggal_berakhir: formatDate(tanggalBerakhir),
    no_sk: title.no_sk,
    tanggal_sk: formatDate(tanggalSK),
    file_url: title.file_url,
    user_id: title.user_id,
  };
};

const updateTitle = async (id, titleData, userId) => {
  const titleId = await validate(getTitleValidation, id);
  const titleValidation = await validate(updateTitleValidation, titleData);
  const titleById = await findTitleById(titleId, userId);

  if (!titleById) {
    throw new ResponseError(404, 'Title not found.');
  }

  if (titleValidation.file) {
    titleValidation.file = titleValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!titleData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    titleValidation.file = titleById.file_url;
  } else if (titleById.file_url !== titleData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', titleById.file_url);
    fileDelete(filePath);
  }

  const title = await editTitle(titleId, titleValidation, userId);

  return {
    id: title.id,
    jabatan: title.jabatan,
    unit_kerja: title.unit_kerja,
    tmt: formatDate(title.tmt),
    tanggal_berakhir: formatDate(title.tanggal_berakhir),
    no_sk: title.no_sk,
    tanggal_sk: formatDate(title.tanggal_sk),
    file_url: title.file_url,
    user_id: title.user_id,
  };
};

const deleteTitleById = async (id, userId) => {
  const titleValidation = await validate(getTitleValidation, id);
  const titleById = await getTitleById(titleValidation, userId);

  if (!titleById) {
    throw new ResponseError(404, 'Title not found.');
  }
  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(titleById.file_url));

  // Hapus file
  fileDelete(filePath);

  const title = await deleteTitle(titleValidation);

  return title;
};

export {
  getAllTitles,
  getAllTitlesByUser,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitleById,
  verifTitle,
};
