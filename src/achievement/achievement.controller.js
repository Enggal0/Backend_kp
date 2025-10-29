import express from 'express';
import {
  createAchievement,
  deleteAchievementById,
  getAchievementById,
  getAllAchievements,
  getAllAchievementsByUser,
  updateAchievement,
  verifAchievement,
} from './achievement.service.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';

const router = express.Router();

// admin role
router.get('/achievements/:userId', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const achievements = await getAllAchievements(id);
    res.status(200).json({
      error: false,
      achievements,
    });
  } catch (error) {
    next(error);
  }
});
router.get('/achievements/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const achievementId = req.params.id;
    const achievements = await getAchievementById(achievementId, id);
    res.status(200).json({
      error: false,
      achievements,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/achievements/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const achievementId = req.params.id;
    const achievementData = req.body;
    const achievement = await verifAchievement(achievementId, achievementData, id);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
});

// user role
router.get('/achievements', async (req, res, next) => {
  try {
    const { id } = req.user;
    const achievements = await getAllAchievementsByUser(id);
    res.status(200).json({
      error: false,
      achievements,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/achievements', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const achievementData = {
      nama: req.body.nama,
      tingkat: req.body.tingkat,
      tahun: req.body.tahun,
      penyelenggara: req.body.penyelenggara,
      file: req.file ? req.file.path : req.file,
    };
    const achievement = await createAchievement(achievementData, id);
    res.status(201).json({
      error: false,
      message: 'Achievement created successfully.',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/achievements/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const achievementId = req.params.id;
    const userAchievements = await getAllAchievementsByUser(id);
    const file = req.file ? req.file.path : userAchievements.file_url;
    const achievementData = {
      nama: req.body.nama,
      tingkat: req.body.tingkat,
      tahun: req.body.tahun,
      penyelenggara: req.body.penyelenggara,
      file,
    };
    const achievement = await updateAchievement(achievementId, achievementData, id);
    res.status(200).json({
      error: false,
      message: 'Achievement updated successfully.',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/achievements/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const achievementId = req.params.id;
    await deleteAchievementById(achievementId, id);
    res.status(200).json({
      error: false,
      message: 'Achievement deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
