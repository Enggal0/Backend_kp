import express from 'express';
import {
  createPosition,
  deletePosition,
  getAllPositions,
  getAllPositionsByUser,
  getPositionById,
  updatePosition,
  verifPosition,
} from './position.service.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

// admin role

router.get('/positions/:userId', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const positions = await getAllPositions(id);

    res.status(200).json({
      status: false,
      positions,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/positions/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const positionId = req.params.id;
    const positions = await getPositionById(positionId, id);

    res.status(200).json({
      status: false,
      positions,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/positions/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const positionId = req.params.id;
    const positionData = req.body;
    const adminUser = req.user;

    const positions = await verifPosition(positionId, positionData, userId, adminUser);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: position,
    });
  } catch (error) {
    next(error);
  }
});

// user role

router.get('/positions', async (req, res, next) => {
  try {
    const { id } = req.user;
    const positions = await getAllPositionsByUser(id);

    res.status(200).json({
      status: false,
      positions,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/positions', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const positionData = {
      ...req.body,
      file: req.file ? req.file.path : req.file,
    };
    const position = await createPosition(positionData, id);

    res.status(201).json({
      status: false,
      message: 'Position created successfully.',
      data: position,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/positions/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const positionById = req.params.id;
    const userPositions = await getAllPositionsByUser(id);
    const file = req.file ? req.file.path : userPositions.file_url;
    const positionData = {
      ...req.body,
      file,
    };
    const position = await updatePosition(positionById, positionData, id);

    res.status(200).json({
      error: false,
      message: 'Position updated successfully.',
      data: position,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/positions/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const positionId = req.params.id;

    await deletePosition(positionId, id);

    res.status(200).json({
      error: false,
      message: 'Position deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
