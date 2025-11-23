import express from 'express';
import {
  createNewStaff,
  getAllStaff,
  getStaffById,
  updateStaffMember,
  deleteStaffMember,
  getAllTahunJabatan,
} from './staff.service.js';
import { imageUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware, authMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/staff', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const userData = {
      nama: req.query.nama,
      nipm: req.query.nipm,
      status_kepegawaian: req.query.status_kepegawaian,
      page: req.query.page,
      size: req.query.size,
    };
    const staff = await getAllStaff(userData, req.user.id);
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
});

router.get('/staff/:id', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staff = await getStaffById(staffId, req.user.id);
    res.status(200).json({
      error: false,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/staff', roleMiddleware('USER'), imageUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const staffData = {
      ...req.body,
      img_url: req.file,
    };
    const newStaff = await createNewStaff(staffData, req.user.id);
    res.status(201).json({
      error: false,
      message: 'Staff created successfully',
      data: newStaff,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/staff/:id', roleMiddleware('USER'), imageUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staffData = {
      ...req.body,
      img_url: req.file,
    };
    const updatedStaff = await updateStaffMember(staffId, staffData, req.user.id);
    res.status(200).json({
      error: false,
      message: 'Staff updated successfully',
      data: updatedStaff,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/staff/:id', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const staffId = req.params.id;
    await deleteStaffMember(staffId, req.user.id);
    res.status(200).json({
      error: false,
      message: 'Staff deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Return list of Tahun Jabatan (masa jabatan)
router.get('/tahun-jabatan', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE', 'USER']), async (req, res, next) => {
  try {
    const tahun = await getAllTahunJabatan();
    res.status(200).json({ error: false, data: tahun });
  } catch (error) {
    next(error);
  }
});

export default router;
