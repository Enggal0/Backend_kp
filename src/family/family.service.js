import path from 'path';
import { findUserById } from '../user/user.repository.js';
import { formatDate, validDate } from '../utils/date-format.js';
import ResponseError from '../utils/response-error.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import {
  createFamilyValidation,
  getFamilyValidation,
  updateFamilyValidation,
} from '../validation/family-validation.js';
import validate from '../validation/validation.js';
import verifValidation from '../validation/verification-validation.js';
import {
  deleteFamily,
  editFamily,
  findAllFamilies,
  findAllFamiliesByUser,
  findFamilyById,
  insertFamily,
  verificationFamily,
} from './family.repository.js';

// admin role
const getAllFamilies = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const families = await findAllFamilies(userId);

  const formattedFamilies = families.map((family) => ({
    ...family,
    tanggal_lahir: formatDate(family.tanggal_lahir),
  }));

  return formattedFamilies;
};

const getFamilyById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const familyId = await validate(getFamilyValidation, id);
  const family = await findFamilyById(familyId, userId);
  if (!family) {
    throw new ResponseError(404, 'Family not found');
  }
  return {
    ...family,
    tanggal_lahir: formatDate(family.tanggal_lahir),
  };
};

export const verifFamily = async (id, familyData, userId, adminUser) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }

  // Restrict SCHOOL_ADMIN to only verify family from their own unit
  if (adminUser.role === 'SCHOOL_ADMIN' && user.unit_kerja_id !== adminUser.unit_kerja_id) {
    throw new ResponseError(403, 'Anda hanya dapat memverifikasi pegawai dari unit kerja Anda');
  }
  const familyById = await findFamilyById(id, userId);

  if (!familyById) {
    throw new ResponseError(404, 'Family not found');
  }
  const famVerifValidation = await validate(verifValidation, familyData);

  if (famVerifValidation.status_verifikasi === 'accepted') {
    famVerifValidation.alasan_ditolak = null;
  }
  const familyVerif = await verificationFamily(id, famVerifValidation, userId);

  return familyVerif;
};

// user role
const getAllFamiliesByUser = async (userId) => {
  const families = await findAllFamiliesByUser(userId);

  const formattedFamilies = families.map((family) => ({
    ...family,
    tanggal_lahir: formatDate(family.tanggal_lahir),
  }));

  return formattedFamilies;
};

const createFamily = async (familyData, userId, file) => {
  const familyValidation = await validate(createFamilyValidation, familyData);
  const tanggalLahir = validDate(familyData.tanggal_lahir);

  if (familyValidation.file) {
    familyValidation.file = familyValidation.file.replace(/\\/g, '/');
  }

  const family = await insertFamily(familyValidation, userId);

  return {
    id: family.id,
    nik: family.nik,
    nama: family.nama,
    tempat: family.tempat,
    tanggal_lahir: formatDate(family.tanggal_lahir),
    jenis_kelamin: family.jenis_kelamin,
    agama: family.agama,
    hubungan_kel: family.hubungan_kel,
    file_url: family.file_url,
    user_id: family.user_id,
  };
};

const updateFamily = async (id, familyData, userId) => {
  const familyId = await validate(getFamilyValidation, id);
  const familyById = await findFamilyById(familyId, userId);

  if (!familyById) {
    throw new ResponseError(404, 'Family not found.');
  }
  const familyValidation = await validate(updateFamilyValidation, familyData);

  if (familyValidation.file) {
    familyValidation.file = familyValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!familyData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    familyValidation.file = familyById.file_url;
  } else if (familyById.file_url !== familyData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(familyById.file_url));
    fileDelete(filePath);
  }

  const family = await editFamily(familyId, familyValidation, userId);

  return {
    id: family.id,
    nik: family.nik,
    nama: family.nama,
    tempat: family.tempat,
    tanggal_lahir: formatDate(family.tanggal_lahir),
    jenis_kelamin: family.jenis_kelamin,
    agama: family.agama,
    hubungan_kel: family.hubungan_kel,
    file_url: family.file_url,
    user_id: family.user_id,
  };
};

const deleteFamilyById = async (id, userId) => {
  const familyValidation = await validate(getFamilyValidation, id);
  const familyById = await findFamilyById(familyValidation);
  if (!familyById) {
    throw new ResponseError(404, 'Family not found.');
  }
  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(familyById.file_url));

  // Hapus file
  fileDelete(filePath);
  const family = await deleteFamily(familyValidation, userId);

  return family;
};

export {
  getAllFamilies,
  getAllFamiliesByUser,
  getFamilyById,
  createFamily,
  updateFamily,
  deleteFamilyById,
};
