import path from 'path';
import salted from 'salted-md5';
import fs from 'fs';
import {
  deleteObject,
  getDownloadURL, getStorage, ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import ResponseError from './response-error.js';
import firebaseConfig from '../config/firebase-config.js';

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export const uploadFile = async (file) => {
  try {
    const name = salted(file.originalname, 'SUPER-S@LT!');
    const ext = name + path.extname(file.originalname);

    const allowedExtensions = '.pdf';

    if (!ext.includes(allowedExtensions)) {
      throw new ResponseError(400, 'Hanya dapat menggunakan file .pdf');
    }

    const storageRef = ref(storage, `files/${ext}`);
    const metaData = {
      contentType: 'application/pdf',
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metaData);

    const downloadUrl = await getDownloadURL(snapshot.ref);

    const fileName = storageRef.name;

    console.log(fileName);

    return {
      file_url: downloadUrl,
      filename: fileName,
    };
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};
export const uploadImage = async (file) => {
  try {
    const name = salted(file.originalname, 'SUPER-S@LT!');
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new ResponseError(400, 'Hanya dapat mengunggah image .png, .jpg, .jpeg ');
    }

    const storageRef = ref(storage, `images/${name}${ext}`);
    const metaData = {
      contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metaData);

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      img_url: downloadUrl,
      filename: storageRef.filename,
    };
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

export const deleteFile = async (fileName) => {
  try {
    const storageRef = ref(storage, `https://firebasestorage.googleapis.com/v0/b/simpeg-pdm-sleman.appspot.com/o/${fileName}`);

    if (!storageRef) {
      console.log(`File ${fileName} sudah ada di Firebase Storage`);
      return true;
    }
    await deleteObject(storageRef);
    console.log(`File ${fileName} berhasil dihapus dari Firebase Storage`);
    return true;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.log(`File ${fileName} sudah tidak ada di Firebase Storage`);
      return true;
    }
    throw new ResponseError(400, error.message);
  }
};

export const fileDelete = (filePath) => {
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    });
  }
};

export const updateFile = async (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
