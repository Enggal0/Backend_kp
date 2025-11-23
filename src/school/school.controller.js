import express from 'express';
import {
  createSchool,
  deleteSchoolById,
  getAllSchools,
  getSchoolById,
  updateSchool,
} from './school.service.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

router.get('/schools', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE', 'USER']), async (req, res, next) => {
  try {
    const schoolData = {
      nama: req.query.nama,
      page: req.query.page,
      size: req.query.size,
    };
    const schools = await getAllSchools(schoolData);
    res.status(200).json(schools);
  } catch (error) {
    next(error);
  }
});

router.get('/schools/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE', 'USER']), async (req, res, next) => {
  try {
    const schoolId = req.params.id;
    const school = await getSchoolById(schoolId);
    res.status(200).json({
      error: false,
      data: school,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/schools', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
  try {
    const schoolData = req.body;
    const school = await createSchool(schoolData);
    res.status(201).json({
      error: false,
      message: 'Schools created',
      data: school,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/schools/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
  try {
    const schoolId = req.params.id;
    const schoolData = req.body;
    const school = await updateSchool(schoolId, schoolData);
    res.status(200).json({
      error: false,
      message: 'Schools updated',
      data: school,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/schools/:id', roleMiddleware(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const schoolId = req.params.id;
    await deleteSchoolById(schoolId);
    res.status(200).json({
      error: false,
      message: 'School Deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
