import express from 'express';
import {
  createTitle,
  deleteTitleById,
  getAllTitles,
  getAllTitlesByUser,
  getTitleById,
  updateTitle,
  verifTitle,
} from './title.service.js';
import { fileUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

// admin role

router.get('/titles/:userId', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const titles = await getAllTitles(id);

    res.status(200).json({
      status: false,
      titles,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/titles/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const titleId = req.params.id;
    const titles = await getTitleById(titleId, id);

    res.status(200).json({
      status: false,
      titles,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/titles/:userId/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.userId;
    const titleById = req.params.id;
    const titleData = req.body;
    const title = await verifTitle(titleById, titleData, id);
    res.status(200).json({
      error: false,
      message: 'Verified Success',
      data: title,
    });
  } catch (error) {
    next(error);
  }
});

// user role

router.get('/titles', async (req, res, next) => {
  try {
    const { id } = req.user;
    const titles = await getAllTitlesByUser(id);
    res.status(200).json({
      status: false,
      titles,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/titles', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const titleData = {
      ...req.body,
      file: req.file ? req.file.path : req.file,
    };
    const title = await createTitle(titleData, id);
    res.status(201).json({
      status: false,
      message: 'Title created successfully.',
      data: title,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/titles/:id', fileUpload, multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const titleId = req.params.id;
    const userTitles = await getAllTitlesByUser(id);
    const file = req.file ? req.file.path : userTitles.file_url;
    const titleData = {
      ...req.body,
      file,
    };
    const title = await updateTitle(titleId, titleData, id);
    res.status(200).json({
      status: false,
      message: 'Title updated successfully.',
      data: title,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/titles/:id', async (req, res, next) => {
  try {
    const { id } = req.user;
    const titleId = req.params.id;
    await deleteTitleById(titleId, id);
    res.status(200).json({
      status: false,
      message: 'Title deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
