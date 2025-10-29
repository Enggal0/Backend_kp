import Joi from 'joi';

export const createSchoolValidation = Joi.object({
  npsn: Joi.string().length(8).pattern(/^[0-9]+$/, { name: 'numbers' })
    .required(),
  nama: Joi.string().required(),
  jenjang: Joi.string().valid('SD', 'SMP', 'SMA').required(),
  alamat: Joi.string().required(),
  kecamatan: Joi.string().required(),
  kelurahan: Joi.string().required(),
});

export const getSchoolValidation = Joi.string().required();

export const updateSchoolValidation = Joi.object({
  npsn: Joi.string().length(8).pattern(/^[0-9]+$/, { name: 'numbers' }).optional(),
  nama: Joi.string().optional(),
  jenjang: Joi.string().valid('SD', 'SMP', 'SMA').optional(),
  alamat: Joi.string().optional(),
  kecamatan: Joi.string().optional(),
  kelurahan: Joi.string().optional(),
});

export const filterSchoolValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100),
  nama: Joi.string().optional(),
});
