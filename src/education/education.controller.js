import express from 'express';
import {
  createEducation,
  deleteEducationById,
  getAllEducation,
  getAllEducationByUser,
  getEducationById,
  updateEducation,
  verifEducation,
} from './education.service.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

// admin role

router.get('/educations/:userId', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const educations = await getAllEducation(id);
    res.status(200).json({
      status: false,
      educations,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/educations/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const educationId = req.params.id;
    const educations = await getEducationById(educationId, id);
    res.status(200).json({
      status: false,
      educations,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/educations/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const educationId = req.params.id;
    const educationData = req.body;
    const education = await verifEducation(educationId, educationData, id);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: education,
    });
  } catch (error) {
    next(error);
  }
});

// user role
router.get('/educations', async (req, res, next) => {
  try {
    const { id } = req.user;
    const educations = await getAllEducationByUser(id);
    res.status(200).json({
      status: false,
      educations,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/educations', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const educationData = {
      jenjang: req.body.jenjang,
      nama: req.body.nama,
      jurusan: req.body.jurusan,
      tahun_lulus: req.body.tahun_lulus,
      file: req.file ? req.file.path : req.file,
    };
    const education = await createEducation(educationData, id);
    res.status(201).json({
      status: false,
      message: 'Education created successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/educations/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const educationId = req.params.id;
    const userEducations = await getAllEducationByUser(id);
    const file = req.file ? req.file.path : userEducations.file_url;
    const educationData = {
      jenjang: req.body.jenjang,
      nama: req.body.nama,
      jurusan: req.body.jurusan,
      tahun_lulus: req.body.tahun_lulus,
      file,
    };
    const education = await updateEducation(educationId, educationData, id);

    res.status(200).json({
      status: false,
      message: 'Education updated successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/educations/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const educationId = req.params.id;
    await deleteEducationById(educationId, id);
    res.status(200).json({
      status: false,
      message: 'Education deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
