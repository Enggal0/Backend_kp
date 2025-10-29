import express from 'express';
import {
  createDocument,
  deleteDocumentById,
  getAllDocuments,
  getAllDocumentsByUser,
  getDocumentById,
  updateDocument,
  verifDocument,
} from './document.service.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

// admin role

router.get('/documents/:userId', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const documents = await getAllDocuments(userId);
    res.status(200).json({
      error: false,
      documents,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/documents/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const documentId = req.params.id;
    const documents = await getDocumentById(documentId, userId);
    res.status(200).json({
      error: false,
      documents,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/documents/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const documentId = req.params.id;
    const documentData = req.body;
    const document = await verifDocument(documentId, documentData, userId);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: document,
    });
  } catch (error) {
    next(error);
  }
});

// user role
router.get('/documents', async (req, res, next) => {
  try {
    const { id } = req.user;
    const documents = await getAllDocumentsByUser(id);
    res.status(200).json({
      error: false,
      documents,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/documents', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const userDocuments = await getAllDocumentsByUser(id);
    const doucmentData = {
      jenis_dokumen: req.body.jenis_dokumen,
      no_dokumen: req.body.no_dokumen,
      file: req.file? req.file.path : req.file,
    };
    const documents = await createDocument(doucmentData, id);
    res.status(201).json({
      error: false,
      messaage: 'Document successfully created',
      data: documents,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/documents/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { id } = req.user;
    const userDocuments = await getAllDocumentsByUser(id);
    const file = req.file ? req.file.path : userDocuments.file_url;
    const documentData = {
      jenis_dokumen: req.body.jenis_dokumen,
      no_dokumen: req.body.no_dokumen,
      file,
    };
    const document = await updateDocument(documentId, documentData, id);
    res.status(200).json({
      error: false,
      messaage: 'Document successfully updated',
      data: document,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/documents/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const documentId = req.params.id;
    await deleteDocumentById(documentId, id);
    res.status(200).json({
      error: false,
      messaage: 'Document successfully deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
