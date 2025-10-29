import joi from 'joi';
import JoiDate from '@joi/date';

const Joi = joi.extend(JoiDate);

const createPositionValidation = Joi.object({
  no_sk: Joi.string().required(),
  tanggal_sk: Joi.date().utc().format('YYYY-MM-DD').required(),
  tmt: Joi.date().utc().format('YYYY-MM-DD').required(),
  gaji_pokok: Joi.number().required(),
  jenis_sk: Joi.string().valid('Pengangkatan Pegawai Tetap', 'Pengangkatan Pegawai Kontrak').required(),
  file: Joi.string().required(),
});

const getPositionValidation = Joi.string().required();

const updatePositionValidation = Joi.object({
  no_sk: Joi.string().optional(),
  tanggal_sk: Joi.date().utc().format('YYYY-MM-DD').optional(),
  tmt: Joi.date().utc().format('YYYY-MM-DD').optional(),
  gaji_pokok: Joi.number().positive().optional(),
  jenis_sk: Joi.string().valid('Pengangkatan Pegawai Tetap', 'Pengangkatan Pegawai Kontrak').optional(),
  file: Joi.string().optional(),
});

export {
  createPositionValidation,
  getPositionValidation,
  updatePositionValidation,
};
