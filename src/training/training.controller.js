import express from 'express';
import {
  createTraining,
  deleteTrainingById,
  getAllTrainings, getAllTrainingsByUser, getTrainingById, updateTraining,
  verifTraining,
} from './training.service.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

// admin role

router.get('/trainings/:userId', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const trainings = await getAllTrainings(id);

    res.status(200).json({
      status: false,
      trainings,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/trainings/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const trainingId = req.params.id;
    const trainings = await getTrainingById(trainingId, id);

    res.status(200).json({
      status: false,
      trainings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/trainings/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const trainingById = req.params.id;
    const trainingData = req.body;
    const trainings = await verifTraining(trainingById, trainingData, id);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: trainings,
    });
  } catch (error) {
    next(error);
  }
});

// user role

router.get('/trainings', async (req, res, next) => {
  try {
    const { id } = req.user;
    const trainings = await getAllTrainingsByUser(id);
    res.status(200).json({
      status: false,
      trainings,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/trainings', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const trainingData = {
      ...req.body,
      file: req.file ? req.file.path : req.file,
    };
    const training = await createTraining(trainingData, id);
    res.status(201).json({
      status: false,
      message: 'Training successfully created.',
      data: training,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/trainings/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const trainingId = req.params.id;
    const userTrainings = await getAllTrainingsByUser(id);
    const file = req.file ? req.file.path : userTrainings.file_url;
    const trainingData = {
      ...req.body,
      file,
    };
    const training = await updateTraining(trainingId, trainingData, id);
    res.status(200).json({
      status: false,
      message: 'Training successfully updated.',
      data: training,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/trainings/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const trainingId = req.params.id;

    await deleteTrainingById(trainingId, id);
    res.status(200).json({
      status: false,
      message: 'Training successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
