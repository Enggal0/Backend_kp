import express from 'express';
import {
  createPerformance,
  deletePerformanceById,
  getAllPerformances,
  getAllPerformancesByUser,
  getPerformanceById,
  updatePerformance,
  verifPerformance,
} from './performance.service.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';

const router = express.Router();

// admin role

router.get('/performances/:userId', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const performances = await getAllPerformances(id);
    res.status(200).json({
      status: false,
      performances,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/performances/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const perfomId = req.params.id;
    const performances = await getPerformanceById(perfomId, id);
    res.status(200).json({
      status: false,
      performances,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/performances/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const performanceId = req.params.id;
    const performanceData = req.body;
    const adminUser = req.user;

    const performances = await verifPerformance(performanceId, performanceData, userId, adminUser);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: performance,
    });
  } catch (error) {
    next(error);
  }
});

// user role

router.get('/performances', async (req, res, next) => {
  try {
    const { id } = req.user;
    const performances = await getAllPerformancesByUser(id);
    res.status(200).json({
      status: false,
      performances,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/performances', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const performanceData = {
      ...req.body,
      file: req.file ? req.file.path : req.file,
    };
    const performance = await createPerformance(performanceData, id);
    res.status(201).json({
      status: false,
      message: 'Performance successfully created.',
      data: performance,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/performances/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const perfomanceId = req.params.id;
    const userPerformances = await getAllPerformancesByUser(id);
    const file = req.file ? req.file.path : userPerformances.file_url;
    const performanceData = {
      ...req.body,
      file,
    };
    const performance = await updatePerformance(perfomanceId, performanceData, id);
    res.status(200).json({
      error: false,
      message: 'Performance successfully updated.',
      data: performance,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/performances/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const performanceById = req.params.id;
    await deletePerformanceById(performanceById, id);
    res.status(200).json({
      error: false,
      message: 'Performance successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
