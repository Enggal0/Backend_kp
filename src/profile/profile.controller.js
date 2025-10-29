import express from 'express';
import { updateProfile, getAllProfiles } from './profile.service.js';
import { roleMiddleware } from '../middleware/authentication.middleware.js';

const router = express.Router();

router.get('/profiles', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const { id } = req.user;
    const profile = await getAllProfiles(id);
    res.status(200).json({
      error: false,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/profiles', roleMiddleware('USER'), async (req, res, next) => {
  try {
    const { id } = req.user;
    const profileData = req.body;
    const profile = await updateProfile(profileData, id);
    res.status(200).json({
      error: false,
      message: 'Profile updated',
      profile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
