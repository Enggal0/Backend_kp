import Joi from 'joi';

const registerValidation = Joi.object({
  nama: Joi.string().required(),
  nipm: Joi.string().length(18).message({
    'string.length': 'nipm at least 18 characters',
  })
    .required(),
  status_kepegawaian: Joi.string().valid('Tetap', 'Kontrak', 'Tidak_Tetap').required(),
  unit_kerja_id: Joi.string().required(),
  password: Joi.string().min(8).message('Password at least 8 characters').required(),
});

const loginValidation = Joi.object({
  nipm: Joi.string().length(18).optional(),
  password: Joi.string().optional(),
});

const getUserValidation = Joi.string().required();

const filterValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100),
  status_kepegawaian: Joi.string().optional(),
  jabatan: Joi.string().optional(),
  nipm: Joi.string().optional(),
  unit_kerja: Joi.string().optional(),
  nama: Joi.string().optional(),
});

const upadateByUserValidation = Joi.object({
  email: Joi.string().email().optional(),
  img: Joi.string().allow(null).optional(),
});

const upadateUserValidation = Joi.object({
  nama: Joi.string().optional(),
  nipm: Joi.string().length(18).message({
    'string.length': 'nipm at least 18 characters',
  })
    .optional(),
  status_kepegawaian: Joi.string().valid('Tetap', 'Kontrak', 'Tidak_Tetap').optional(),
  unit_kerja_id: Joi.string().optional(),
  // password: Joi.string().length(8).message('Password at least 8 characters').optional(),
});

const updatePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string().required(),
});

export {
  registerValidation,
  loginValidation,
  getUserValidation,
  filterValidation,
  upadateUserValidation,
  upadateByUserValidation,
  updatePasswordValidation,
};
