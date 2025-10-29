import express from 'express';
import {
  getAllUsers,
  createUser, loginUser,
  logoutUser,
  getUserByNIPM,
  deleteUserById,
  getDetailUser,
  updateUser,
  getUserDashboard,
  getChart,
  updateUserByAdmin,
  updatePasswordUser,
  getUserById,
} from './user.service.js';
import { imageUpload, multerErrorHandler } from '../middleware/upload-file-middleware.js';
import { roleMiddleware, authMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);

    res.status(201).json({
      status: false,
      message: 'User created successfull',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await loginUser(userData);
    // res.cookie('token', user.token, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 });
    // res.cookie('token', user.token, { httpOnly: true });
    res.status(200).json({
      status: false,
      message: 'Login successfull',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.use(authMiddleware);

router.get('/users/dashboard', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const { nipm } = req.user;
    const user = await getUserDashboard(nipm);
    res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users/current', async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUserById(id);
    res.status(200).json({
      error: false,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users/navbar', async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUserByNIPM(id);
    res.status(200).json({
      error: false,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users/profile/:id', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/forgot-password', async (req, res, next) => {
  try {
    const { id } = req.user;
    const userData = req.body;
    await updatePasswordUser(id, userData);
    res.status(200).json({
      error: false,
      message: 'Password updated',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', async (req, res, next) => {
  try {
    const { id } = req.user;
    await logoutUser(id);
    res.status(200).json({
      status: false,
      message: 'Logout successfull',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users', imageUpload, roleMiddleware('USER'), multerErrorHandler, async (req, res, next) => {
  try {
    const { id } = req.user;
    const userId = await getUserById(id);
    const img = req.file ? req.file.path : userId.img_url;
    const userData = {
      email: req.body.email,
      img,
    };
    const user = await updateUser(id, userData);
    res.status(200).json({
      error: false,
      message: 'User updated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// admin routers

router.get('/users', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const userData = {
      status_kepegawaian: req.query.status_kepegawaian,
      nama: req.query.nama,
      page: req.query.page,
      jabatan: req.query.jabatan,
      unit_kerja: req.query.unit_kerja,
      nipm: req.query.nipm,
      size: req.query.size,
    };
    const users = await getAllUsers(userData);
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/users/count', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const user = await getChart();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getDetailUser(userId);
    res.status(200).json({
      error: false,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const user = await updateUserByAdmin(userId, userData);
    res.status(200).json({
      error: false,
      message: 'User updated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', roleMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    await deleteUserById(userId);
    res.status(200).json({
      error: false,
      message: 'User deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
