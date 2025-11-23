import {
  createStaff,
  findAllStaff,
  findStaffById,
  updateStaff,
  deleteStaff,
} from './staff.repository.js';
import validate from '../validation/validation.js';
import {
  createStaffValidation,
  updateStaffValidation,
  getStaffValidation,
  filterStaffValidation,
} from '../validation/staff-validation.js';
import ResponseError from '../utils/response-error.js';
import {
  uploadImage,
  deleteFile,
} from '../utils/upload-file.js';
import prisma from '../config/database.js';

const getAllTahunJabatan = async () => {
  // TahunJabatan table removed — return a computed list of recent masa jabatan
  const now = new Date();
  const year = now.getFullYear();
  const list = [];
  // provide the last two masa jabatan ranges (Jul..Jun)
  for (let i = 0; i < 2; i++) {
    const start = new Date(`${year - i - 1}-07-01`);
    const end = new Date(`${year - i}-06-30`);
    list.push({
      id: `${start.getFullYear()}_${end.getFullYear()}`,
      nama: `${start.getFullYear()}/${end.getFullYear()}`,
      mulai: start,
      selesai: end,
      aktif: i === 0 ? true : false,
    });
  }
  return list;
};

const getAllStaff = async (userData, currentUserId) => {
  const searchValidation = await validate(filterStaffValidation, userData);
  const staff = await findAllStaff(searchValidation, currentUserId);
  return staff;
};

const getStaffById = async (id, currentUserId) => {
  const staffId = await validate(getStaffValidation, id);
  const staff = await findStaffById(staffId, currentUserId);
  if (!staff) {
    throw new ResponseError(404, 'Staff not found.');
  }
  return staff;
};

const createNewStaff = async (staffData, currentUserId) => {
  const staffValidation = await validate(createStaffValidation, staffData);
  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
  });
  if (user.role === 'SCHOOL_ADMIN') {
    staffValidation.unit_kerja_id = user.unit_kerja_id;
  }

  let uploadedImg = null;
  if (staffData.img_url) {
    uploadedImg = await uploadImage(staffData.img_url);
    staffValidation.img_url = uploadedImg.img_url;
  }

  try {
    const newStaff = await createStaff(staffValidation, currentUserId);
    return newStaff;
  } catch (error) {
    if (uploadedImg) {
      await deleteFile(uploadedImg.filename, 'images/');
    }
    throw error;
  }
};

const updateStaffMember = async (id, staffData, currentUserId) => {
  const staffId = await validate(getStaffValidation, id);
  const staffValidation = await validate(updateStaffValidation, staffData);

  const existingStaff = await findStaffById(staffId, currentUserId);
  if (!existingStaff) {
    throw new ResponseError(404, 'Staff not found.');
  }

  const oldImgUrl = existingStaff.img_url;
  let newImgUrl = null;

  if (staffData.img_url) {
    newImgUrl = await uploadImage(staffData.img_url);
    staffValidation.img_url = newImgUrl.img_url;

    if (oldImgUrl) {
      const oldFilename = oldImgUrl.substring(oldImgUrl.lastIndexOf('/') + 1, oldImgUrl.indexOf('?'));
      await deleteFile(oldFilename, 'images/');
    }
  }

  const updatedStaff = await updateStaff(staffId, staffValidation, currentUserId);
  return updatedStaff;
};

const deleteStaffMember = async (id, currentUserId) => {
  const staffId = await validate(getStaffValidation, id);
  const staffToDelete = await findStaffById(staffId, currentUserId);

  if (staffToDelete.img_url) {
    const filename = staffToDelete.img_url.substring(staffToDelete.img_url.lastIndexOf('/') + 1, staffToDelete.img_url.indexOf('?'));
    await deleteFile(filename, 'images/');
  }

  const deletedStaff = await deleteStaff(staffId, currentUserId);
  return deletedStaff;
};

export {
  getAllStaff,
  getStaffById,
  createNewStaff,
  updateStaffMember,
  deleteStaffMember,
  getAllTahunJabatan,
};
