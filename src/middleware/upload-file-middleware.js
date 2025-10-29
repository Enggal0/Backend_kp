import path from 'path';
import multer from 'multer';
import ResponseError from '../utils/response-error.js';

const maxSize = 2 * 1024 * 1024;

const filterFile = (req, file, cb) => {
  const allowedExtensions = ['application/pdf'];
  if (!allowedExtensions.includes(file.mimetype)) {
    const error = new ResponseError(400, 'Only PDF files are allowed');
    error.code = 'LIMIT_FILE_TYPES';
    cb(error, false);
  } else {
    cb(null, true);
  }
};
const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedExtensions.includes(file.mimetype)) {
    const error = new ResponseError(400, 'Only image files are allowed');
    error.code = 'LIMIT_FILE_TYPES';
    cb(error, false);
  } else {
    cb(null, true);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/files/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now() + path.extname(file.originalname)}`);
  },
});

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now() + path.extname(file.originalname)}`);
  },
});

const imageUpload = multer({
  storage: storageImage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: imageFilter,
}).single('img');

const fileUpload = multer({
  storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: filterFile,
}).single('file');

const multerErrorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_TYPES') {
    return res.status(400).json({
      error: true,
      message: err.message,
    })
  }
  next(err);
};

export {
  multerErrorHandler,
  imageUpload,
  fileUpload,
};
