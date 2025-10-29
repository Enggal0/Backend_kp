import prisma from '../config/database.js';

export const findAllDocuments = async (userId) => {
  const documents = await prisma.document.findMany({
    where: {
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
  });

  return documents;
};
export const findAllDocumentsByUser = async (userId) => {
  const documents = await prisma.document.findMany({
    where: {
      user_id: userId,
    },
  });

  return documents;
};

export const insertDocument = async (documentData, userId) => {
  const document = await prisma.document.create({
    data: {
      jenis_dokumen: documentData.jenis_dokumen,
      no_dokumen: documentData.no_dokumen,
      file_url: documentData.file,
      user_id: userId,
    },
  });

  return document;
};

export const findDocumentById = async (id, userId) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
      user_id: userId,
    },
  });
  return document;
};

export const editDocument = async (id, documentData, userId) => {
  const document = await prisma.document.update({
    where: {
      id,
      user_id: userId,
    },
    data: {
      jenis_dokumen: documentData.jenis_dokumen,
      no_dokumen: documentData.no_dokumen,
      file_url: documentData.file,
    },
  });
  return document;
};

export const deleteDocument = async (id, userId) => {
  const document = await prisma.document.delete({
    where: {
      id,
      user_id: userId,
    },
  });
  return document;
};

export const verificationDocument = async (id, documenttData, userId) => {
  const verifDoucment = await prisma.document.update({
    where: {
      id,
      user_id: userId,
      user: {
        role: 'USER',
      },
    },
    data: {
      status_verifikasi: documenttData.status_verifikasi,
      alasan_ditolak: documenttData.alasan_ditolak,
    },
  });
  return verifDoucment;
};
