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

const ALL_ROLES = ['USER', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'EXECUTIVE'];
const ADMIN_ROLES = ['SUPER_ADMIN', 'SCHOOL_ADMIN'];

router.get('/users/dashboard', roleMiddleware(ALL_ROLES), async (req, res, next) => {
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

router.get('/users/profile/:id', roleMiddleware(ALL_ROLES), async (req, res, next) => {
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

router.patch('/users', imageUpload, roleMiddleware(ALL_ROLES), multerErrorHandler, async (req, res, next) => {
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

router.get('/users', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const userData = {
      status_kepegawaian: req.query.status_kepegawaian,
      nama: req.query.nama,
      page: req.query.page,
      jabatan: req.query.jabatan,
      unit_kerja: req.query.unit_kerja,
      nipm: req.query.nipm,
      size: req.query.size,
      userRole: req.user.role,
      userUnitKerjaId: req.user.unit_kerja_id,
    };
    const users = await getAllUsers(userData);
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// Admin-only create user (used by admin UI). Keeps public /register unchanged.
router.post('/users', roleMiddleware(ADMIN_ROLES), async (req, res, next) => {
  try {
    const userData = req.body;
    console.log('POST /api/users - admin payload:', JSON.stringify(userData));
    // Attach the admin who creates this user, so we can set createdByUserId for staff if needed
    userData.createdByUserId = req.user.id;
    const user = await createUser(userData);
    res.status(201).json({
      error: false,
      message: 'User created successfully by admin',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users/count', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
  try {
    const user = await getChart();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EXECUTIVE']), async (req, res, next) => {
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

router.patch('/users/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
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

router.delete('/users/:id', roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']), async (req, res, next) => {
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

