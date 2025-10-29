import ResponseError from '../utils/response-error.js';
import {
  createSchoolValidation,
  filterSchoolValidation,
  getSchoolValidation, updateSchoolValidation,
} from '../validation/school-validation.js';
import validate from '../validation/validation.js';
import {
  deleteSchool,
  editSchool,
  findAllSchools,
  findSchoolById,
  insertSchool,
} from './school.repository.js';

export const getAllSchools = async (schoolData) => {
  const schoolValidation = await validate(filterSchoolValidation, schoolData);
  const schools = await findAllSchools(schoolValidation);
  return schools;
};

export const getSchoolById = async (id) => {
  const schoolId = await validate(getSchoolValidation, id);
  const school = await findSchoolById(schoolId);
  if (!school) {
    throw new ResponseError(404, 'School not found');
  }
  return school;
};

export const createSchool = async (schoolData) => {
  const schoolValidation = await validate(createSchoolValidation, schoolData);
  const school = await insertSchool(schoolValidation);
  return school;
};

export const updateSchool = async (id, schoolData) => {
  const schoolId = await validate(getSchoolValidation, id);
  const schoolById = await findSchoolById(schoolId);
  if (!schoolById) {
    throw new ResponseError(404, 'School not found');
  }
  const schoolValidation = await validate(updateSchoolValidation, schoolData);

  const school = await editSchool(schoolId, schoolValidation);
  return school;
};

export const deleteSchoolById = async (id) => {
  const schoolId = await validate(getSchoolValidation, id);
  const schoolById = await findSchoolById(schoolId);
  if (!schoolById) {
    throw new ResponseError(404, 'School not found');
  }
  const school = await deleteSchool(schoolId);
  return school;
};
