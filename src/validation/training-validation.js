import Joi from 'joi';

const createTrainingValidation = Joi.object({
  nama: Joi.string().required(),
  penyelenggara: Joi.string().required(),
  jpl: Joi.number().integer().positive().required(),
  tahun_kegiatan: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun Kegiatan must be 4 digits long.',
      'number.min': 'Tahun Kegiatan must be 4 digits long.',
      'number.base': 'Tahun Kegiatan must be a number',
    })
    .required(),
  file: Joi.string().required(),
});

const getTrainingValidation = Joi.string().required();

const updateTrainingValidation = Joi.object({
  nama: Joi.string().optional(),
  penyelenggara: Joi.string().optional(),
  jpl: Joi.number().integer().positive().optional(),
  tahun_kegiatan: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun Kegiatan must be 4 digits long.',
      'number.min': 'Tahun Kegiatan must be 4 digits long.',
      'number.base': 'Tahun Kegiatan must be a number',
    })
    .optional(),
  file: Joi.string().optional(),
});

export {
  createTrainingValidation,
  getTrainingValidation,
  updateTrainingValidation,
};
