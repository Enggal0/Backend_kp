import Joi from 'joi';

const createAchievementValidation = Joi.object({
  nama: Joi.string().required(),
  tingkat: Joi.string().required(),
  tahun: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun must be 4 digits long.',
      'number.min': 'Tahun must be 4 digits long.',
      'number.base': 'Tahun must be a number',
    })
    .required(),
  penyelenggara: Joi.string().required(),
  file: Joi.string().required(),
});

const getAchievementValidation = Joi.string().required();

const updateAchievementValidation = Joi.object({
  nama: Joi.string().optional(),
  tingkat: Joi.string().optional(),
  tahun: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun must be 4 digits long.',
      'number.min': 'Tahun must be 4 digits long.',
      'number.base': 'Tahun must be a number',
    })
    .optional(),
  penyelenggara: Joi.string().optional(),
  file: Joi.string().optional(),
});
export {
  createAchievementValidation,
  getAchievementValidation,
  updateAchievementValidation,
};
