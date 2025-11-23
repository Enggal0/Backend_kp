import express from 'express';
import {
  createFamily,
  deleteFamilyById,
  getAllFamilies,
  getAllFamiliesByUser,
  getFamilyById,
  updateFamily,
  verifFamily,
} from './family.service.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';

const router = express.Router();

// admin role
router.get('/families/:userId', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const families = await getAllFamilies(id);
    res.status(200).json({
      status: false,
      families,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/families/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const famId = req.params.id;
    const families = await getFamilyById(famId, id);
    res.status(200).json({
      status: false,
      families,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/families/:userId/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
  try {
    // const { role } = req.user;
    const userId = req.params.userId;
    const familyId = req.params.id;
    const familyData = req.body;
    const adminUser = req.user;

    const family = await verifFamily(familyId, familyData, userId, adminUser);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: family,
    });
  } catch (error) {
    next(error);
  }
});

// user role
router.get('/families', async (req, res, next) => {
  try {
    const { id } = req.user;
    const families = await getAllFamiliesByUser(id);

    res.status(200).json({
      status: false,
      families,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/families', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const familyData = {
      ...req.body,
      file: req.file ? req.file.path : req.file,
    };
    const family = await createFamily(familyData, id);
    res.status(201).json({
      error: false,
      message: 'Family created successfully',
      data: family,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/families/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const familyId = req.params.id;
    const userFamilies = await getAllFamiliesByUser(id);
    const file = req.file ? req.file.path : userFamilies.file_url;
    const familyData = {
      ...req.body,
      file,
    };

    const family = await updateFamily(familyId, familyData, id);
    res.status(200).json({
      status: false,
      message: 'Family updated successfully',
      data: family,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/families/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const familyId = req.params.id;
    await deleteFamilyById(familyId, id);

    res.status(200).json({
      error: false,
      message: 'Family deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
