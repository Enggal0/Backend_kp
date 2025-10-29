import path from 'path';
import bcrypt from 'bcrypt';
import {
  deleteToken,
  deleteUser,
  editPasswordUser,
  editUser,
  editUserByAdmin,
  findAllUsers,
  findChart,
  findPasswordUser,
  findDetailUserById,
  findUserByNIPM,
  findUserCurrent,
  insertUser,
  updateTokenUserByNIPM,
  userDashboard,
  findUserById,
  findUserByEmail,
} from './user.repository.js';
import validate from '../validation/validation.js';
import {
  registerValidation,
  loginValidation,
  getUserValidation,
  filterValidation,
  upadateUserValidation,
  upadateByUserValidation,
  updatePasswordValidation,
} from '../validation/user-validation.js';
import ResponseError from '../utils/response-error.js';
import {
  deleteFile, fileDelete,
  updateFile, uploadImage,
} from '../utils/upload-file.js';
import { ChartEducation } from '../education/education.repository.js';
import { formatDate } from '../utils/date-format.js';

const getAllUsers = async (userData) => {
  const searchValidation = await validate(filterValidation, userData);
  const users = await findAllUsers(searchValidation);

  return users;
};

const getUserByNIPM = async (id) => {
  const userValidation = await validate(getUserValidation, id);
  const user = await findUserCurrent(userValidation);
  return user;
};

const getDetailUser = async (id) => {
  const userValidation = await validate(getUserValidation, id);
  const user = await findDetailUserById(userValidation);
  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  return {
    ...user,
    profile: {
      ...user.profile,
      tanggal_lahir: formatDate(user.profile.tanggal_lahir),
    },
  };
};

const getUserById = async (id) => {
  const userId = await validate(getUserValidation, id);
  const user = await findUserById(userId);
  if (!user) {
    throw new ResponseError(404, 'User not found');
  }
  return {
    id: user.id,
    nama: user.nama,
    nipm: user.nipm,
    status_kepegawaian: user.status_kepegawaian,
    unit_kerja: {
      nama: user.unit_kerja.nama,
    },
    img_url: user.img_url,
    email: user.email,
  };
};

const createUser = async (userData) => {
  const existingUserByUsername = await findUserByNIPM(userData.nipm);
  if (existingUserByUsername) {
    throw new ResponseError(400, 'NIPM is already exists.');
  }
  const userValidation = validate(registerValidation, userData);
  const user = await insertUser(userValidation);

  return user;
};

const loginUser = async (userData) => {
  const userValidation = await validate(loginValidation, userData);

  // const usernameValidation = await validate(getUserNameValidation, userData.username);
  const user = await findUserByNIPM(userValidation.nipm);

  if (!user) {
    throw new ResponseError(400, 'User does not exist');
  }

  const comparePassword = await bcrypt.compare(userValidation.password, user.password);
  if (!comparePassword) {
    throw new ResponseError(400, 'NIPM or Password wrong.');
  }

  const updateToken = await updateTokenUserByNIPM(user, user.nipm);

  return updateToken;
};

const logoutUser = async (id) => {
  const userValidation = await validate(getUserValidation, id);
  const user = await deleteToken(userValidation);

  return user;
};

const deleteUserById = async (id) => {
  const userValidation = await validate(getUserValidation, id);
  const userById = await findUserById(userValidation);
  if (!userById) {
    throw new ResponseError(404, 'User does not exist');
  }
  if (userById.img_url && userById.img_url) {
    const filePath = path.join('src/uploads/images', path.basename(userById.img_url));
    fileDelete(filePath);
  }
  const user = await deleteUser(userValidation);

  return user;
};

const updateUser = async (id, userData) => {
  const userId = validate(getUserValidation, id);
  const userValidation = await validate(upadateByUserValidation, userData);
  const userById = await findUserById(userId);
  if (!userById) {
    throw new ResponseError(404, 'User does not exist');
  }
  if (!userValidation.email) {
    userById.email = userById.email;
  } else {
    const userExist = await findUserByEmail(userValidation.email);
    if (userExist) {
      throw new ResponseError(400, 'Email has been already taken');
    }
  }

  if (userValidation.img) {
    userValidation.img = userValidation.img.replace(/\\/g, '/');
  }

  // Periksa apakah file baru diunggah atau tidak
  if (!userValidation.img) {
    // Jika tidak ada img baru, gunakan img yang lama
    userValidation.img = userById.img_url;
  }

  // Lakukan pembaruan user terlebih dahulu
  const user = await editUser(userId, userValidation);

  // Setelah pembaruan user berhasil, hapus gambar lama jika ada gambar baru
  if (userValidation.img && userById.img_url !== userValidation.img) {
    const imgPath = path.join('src/uploads/images', path.basename(userById.img_url));
    await updateFile(imgPath);
    return user;
  }
};

const getUserDashboard = async (nipm) => {
  const user = await userDashboard(nipm);
  return user;
};

const getChart = async () => {
  const educationChart = await ChartEducation();
  const userChart = await findChart();
  return {
    userChart,
    educationChart,
  };
};

const updateUserByAdmin = async (id, userData) => {
  const userId = await validate(getUserValidation, id);

  const userById = await findUserById(userId);
  if (!userById) {
    throw new ResponseError(404, 'User not found');
  }

  const userValidation = await validate(upadateUserValidation, userData);

  const user = await editUserByAdmin(userId, userValidation);
  return user;
};

const updatePasswordUser = async (id, userData) => {
  const userById = await findUserById(id);
  if (!userById) {
    throw new ResponseError(404, 'User not found');
  }
  const userPassword = await findPasswordUser(id);

  const userValidation = await validate(updatePasswordValidation, userData);

  const comparePassword = await bcrypt.compare(userValidation.oldPassword, userPassword.password);
  if (!comparePassword) {
    throw new ResponseError(400, 'Old Password wrong.');
  }

  const user = await editPasswordUser(id, userValidation);

  if (user) {
    const logout = await deleteToken(user.id);
    return logout;
  }
  return user;
};

export {
  getAllUsers,
  getDetailUser,
  getUserById,
  createUser,
  loginUser,
  logoutUser,
  getUserByNIPM,
  deleteUserById,
  updateUser,
  getUserDashboard,
  getChart,
  updateUserByAdmin,
  updatePasswordUser,
};
