import Joi from 'joi';

const createPerformanceValidation = Joi.object({
  nilai_kerja: Joi.number().integer().min(1).positive()
    .required(),
  predikat: Joi.string().valid('A', 'AB', 'B', 'BC', 'C', 'D', 'E').required(),
  tahun: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun must be 4 digits long.',
      'number.min': 'Tahun must be 4 digits long.',
      'number.base': 'Tahun must be a number',
    })
    .required(),
  file: Joi.string().required(),
});

const getPerformanceValidation = Joi.string().required();

const updatePerformanceValidation = Joi.object({
  nilai_kerja: Joi.number().integer().min(1).positive()
    .optional(),
  predikat: Joi.string().valid('A', 'AB', 'B', 'BC', 'C', 'D', 'E').optional(),
  tahun: Joi.number().min(1000).max(9999)
    .messages({
      'number.max': 'Tahun must be 4 digits long.',
      'number.min': 'Tahun must be 4 digits long.',
      'number.base': 'Tahun must be a number',
    })
    .optional(),
  file: Joi.string().optional(),
});

export {
  createPerformanceValidation,
  getPerformanceValidation,
  updatePerformanceValidation,
};
