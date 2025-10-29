/* eslint-disable no-underscore-dangle */
import express, { json, urlencoded } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';
import userController from './src/user/user.controller.js';
import familyController from './src/family/family.controller.js';
import positionController from './src/position/position.controller.js';
import educationController from './src/education/education.controller.js';
import trainingController from './src/training/training.controller.js';
import titleController from './src/title/title.controller.js';
import achievementController from './src/achievement/achievement.controller.js';
import performanceController from './src/performance/performance.controller.js';
import errorMiddleware from './src/middleware/error-middleware.js';
import { authMiddleware } from './src/middleware/authentication.middleware.js';
import documentController from './src/document/document.controller.js';
import profileController from './src/profile/profile.controller.js';
import schoolController from './src/school/school.controller.js';
import staffController from './src/staff/staff.controller.js';
import { fileUpload, imageUpload, multerErrorHandler } from './src/middleware/upload-file-middleware.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: '*',
}));
app.use(logger('dev'));
app.use('/src/uploads/files', express.static('src/uploads/files'));
app.use('/src/uploads/images', express.static('src/uploads/images'));
app.use(json());
app.use(urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Welcome to SIMPEG PDM Sleman API');
});

app.use('/api', userController);
app.use(authMiddleware);
app.use('/api', staffController);
app.use('/api', achievementController);
app.use('/api', profileController);
app.use('/api', familyController);
app.use('/api', positionController);
app.use('/api', educationController);
app.use('/api', trainingController);
app.use('/api', titleController);
app.use('/api', performanceController);
app.use('/api', documentController);
app.use('/api', schoolController);
app.use(errorMiddleware);
app.use(multerErrorHandler);
app.use(fileUpload, imageUpload);

export default app;
