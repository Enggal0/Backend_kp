import joi from 'joi';
import JoiDate from '@joi/date';

const Joi = joi.extend(JoiDate);

const createTitleValidation = Joi.object({
  jabatan: Joi.string().required(),
  unit_kerja: Joi.string().required(),
  tmt: Joi.date().utc().format('YYYY-MM-DD').required(),
  tanggal_berakhir: Joi.date().utc().format('YYYY-MM-DD').required(),
  no_sk: Joi.string().required(),
  tanggal_sk: Joi.date().utc().format('YYYY-MM-DD').required(),
  file: Joi.string().required(),
});

const getTitleValidation = Joi.string().required();

const updateTitleValidation = Joi.object({
  jabatan: Joi.string().optional(),
  unit_kerja: Joi.string().optional(),
  tmt: Joi.date().utc().format('YYYY-MM-DD').optional(),
  tanggal_berakhir: Joi.date().utc().format('YYYY-MM-DD').optional(),
  no_sk: Joi.string().optional(),
  tanggal_sk: Joi.date().utc().format('YYYY-MM-DD').optional(),
  file: Joi.string().optional(),
});

export {
  createTitleValidation,
  getTitleValidation,
  updateTitleValidation,
};
