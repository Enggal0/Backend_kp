import joi from 'joi';
import JoiDate from '@joi/date';

const Joi = joi.extend(JoiDate);

const createFamilyValidation = Joi.object({
  nik: Joi.string().length(16)
    .pattern(/^[0-9]+$/, { name: 'numbers' })
    .message('NIK harus 16 karakter')
    .required(),
  nama: Joi.string().required(),
  tempat: Joi.string().required(),
  tanggal_lahir: Joi.date().utc().format('YYYY-MM-DD').required(),
  jenis_kelamin: Joi.string().valid('Laki_Laki', 'Perempuan').required(),
  agama: Joi.string().required(),
  hubungan_kel: Joi.string().required(),
  file: Joi.string().required(),
});

const getFamilyValidation = Joi.string().required();

const getFamilyByUserValidation = Joi.object({
  user_id: Joi.string().required(),
});

const updateFamilyValidation = Joi.object({
  nik: Joi.string().length(16)
    .pattern(/^[0-9]+$/, { name: 'numbers' })
    .message('NIK harus 16 karakter')
    .optional(),
  nama: Joi.string().optional(),
  tempat: Joi.string().optional(),
  tanggal_lahir: Joi.date().utc().format('YYYY-MM-DD').optional(),
  jenis_kelamin: Joi.string().valid('Laki_Laki', 'Perempuan').optional(),
  agama: Joi.string().valid('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu').optional(),
  hubungan_kel: Joi.string().optional(),
  file: Joi.string().optional(),
});

export {
  getFamilyValidation,
  createFamilyValidation,
  updateFamilyValidation,
  getFamilyByUserValidation,
};
