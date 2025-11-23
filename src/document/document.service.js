import path from 'path';
import ResponseError from '../utils/response-error.js';
import { createDocumentValidation, getDocumentValidation, updateDocumentValidation } from '../validation/document-validation.js';
import validate from '../validation/validation.js';
import {
  deleteDocument,
  editDocument,
  findAllDocuments,
  findAllDocumentsByUser,
  findDocumentById,
  insertDocument,
  verificationDocument,
} from './document.respository.js';
import { deleteFile, fileDelete, uploadFile } from '../utils/upload-file.js';
import verifValidation from '../validation/verification-validation.js';
import { findUserById } from '../user/user.repository.js';

// admin role
export const getAllDocuments = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const documents = await findAllDocuments(userId);

  return documents;
};

export const verifDocument = async (id, documentData, userId, adminUser) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }

  // Restrict SCHOOL_ADMIN to only verify document from their own unit
  if (adminUser.role === 'SCHOOL_ADMIN' && user.unit_kerja_id !== adminUser.unit_kerja_id) {
    throw new ResponseError(403, 'Anda hanya dapat memverifikasi pegawai dari unit kerja Anda');
  }
  const documentById = await findDocumentById(id, userId);

  if (!documentById) {
    throw new ResponseError(404, 'Document not found');
  }

  const docVerifValidation = await validate(verifValidation, documentData);

  if (docVerifValidation.status_verifikasi === 'accepted') {
    docVerifValidation.alasan_ditolak = null;
  }

  const documentVerif = await verificationDocument(id, docVerifValidation, userId);

  return documentVerif;
};

// user role
export const getAllDocumentsByUser = async (userId) => {
  const documents = await findAllDocumentsByUser(userId);

  return documents;
};

export const getDocumentById = async (id, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  const document = await findDocumentById(id, userId);

  if (!document) {
    throw new ResponseError(404, 'Document not found.');
  }

  return document;
};

export const createDocument = async (documentData, userId) => {
  const doucmentValidation = await validate(createDocumentValidation, documentData);

  if (!doucmentValidation.files) {
    doucmentValidation.file = doucmentValidation.file.replace(/\\/g, '/');
  }

  const document = await insertDocument(doucmentValidation, userId);

  return document;
};

export const updateDocument = async (id, documentData, userId) => {
  const documentById = await findDocumentById(id);

  if (!documentById) {
    throw new ResponseError(404, 'Document not found.');
  }
  const doucmentValidation = await validate(updateDocumentValidation, documentData);

  if (doucmentValidation.file) {
    doucmentValidation.file = doucmentValidation.file.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!documentData.file) {
    // Jika tidak ada file baru, gunakan file yang lama
    doucmentValidation.file = documentById.file_url;
  } else if (documentById.file_url !== documentData.file) {
    // Jika ada file baru dan berbeda dengan file lama, hapus file lama
    const filePath = path.join('src/uploads/files', path.basename(documentById.file_url));
    fileDelete(filePath);
  }

  const document = await editDocument(id, doucmentValidation, userId);

  return document;
};

export const deleteDocumentById = async (id, userId) => {
  const documentId = await validate(getDocumentValidation, id);
  const documentById = await findDocumentById(id);

  if (!documentById) {
    throw new ResponseError(404, 'Document not found.');
  }

  // Dapatkan path file yang ingin dihapus
  const filePath = path.join('src/uploads/files', path.basename(documentById.file_url));

  // Hapus file
  fileDelete(filePath);
  const document = await deleteDocument(documentId);

  return document;
};
