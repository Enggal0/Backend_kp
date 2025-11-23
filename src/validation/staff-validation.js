import Joi from 'joi';

const createStaffValidation = Joi.object({
  nama: Joi.string().required(),
  nipm: Joi.string().length(18).message({
    'string.length': 'nipm at least 18 characters',
  }).required(),
  status_kepegawaian: Joi.string().valid('Tetap', 'Kontrak', 'Tidak_Tetap').required(),
  email: Joi.string().email().optional().allow(null, ''),
  img_url: Joi.string().optional().allow(null, ''),
  unit_kerja_id: Joi.string().optional().allow(null, ''),
  jenis_jabatan: Joi.string().valid('KEPALA_SEKOLAH','WAKIL_KEPALA_SEKOLAH','BENDAHARA','GURU','STAF','ADMIN','LAINNYA').optional(),
  tahun_jabatan_mulai: Joi.date().optional(),
  tahun_jabatan_selesai: Joi.date().optional(),
});

const updateStaffValidation = Joi.object({
  nama: Joi.string().optional(),
  nipm: Joi.string().length(18).message({
    'string.length': 'nipm at least 18 characters',
  }).optional(),
  status_kepegawaian: Joi.string().valid('Tetap', 'Kontrak', 'Tidak_Tetap').optional(),
  email: Joi.string().email().optional().allow(null, ''),
  img_url: Joi.string().optional().allow(null, ''),
});

const getStaffValidation = Joi.string().required();

const filterStaffValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100),
  nama: Joi.string().optional(),
  nipm: Joi.string().optional(),
  status_kepegawaian: Joi.string().optional(),
});

export {
  createStaffValidation,
  updateStaffValidation,
  getStaffValidation,
  filterStaffValidation,
};
