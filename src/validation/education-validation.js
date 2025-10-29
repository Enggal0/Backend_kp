import Joi from 'joi';

const createEducationValidation = Joi.object({
  jenjang: Joi.string().valid('SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3').required(),
  nama: Joi.string().required(),
  jurusan: Joi.string().required(),
  tahun_lulus: Joi.number().min(1000).max(9999)
    .required()
    .messages({
      'number.required': 'Tahun Lulus is required',
      'number.empty': 'Tahun Lulus cannot be empty',
      'number.base': 'Tahun Lulus must be a number',
      'number.max': 'Tahun Lulus must be 4 digits long.',
      'number.min': 'Tahun Lulus must be 4 digits long.',
    }),
  file: Joi.string().required(),
});

const getEducationValidation = Joi.string().required();

const updateEducationValidation = Joi.object({
  jenjang: Joi.string().valid('SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3').optional(),
  nama: Joi.string().optional(),
  jurusan: Joi.string().optional(),
  tahun_lulus: Joi.number().integer().optional(),
  file: Joi.string().optional(),
});

export {
  createEducationValidation,
  updateEducationValidation,
  getEducationValidation,
};
