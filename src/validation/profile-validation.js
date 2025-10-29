import joi from 'joi';
import JoiDate from '@joi/date';

const Joi = joi.extend(JoiDate);

const updateProfileValidation = Joi.object({
  gelar_depan: Joi.string().allow(null, ""),
  gelar_belakang: Joi.string().allow(null, ""),
  jenis_kelamin: Joi.string().valid('Laki_Laki', 'Perempuan').optional(),
  tempat_lahir: Joi.string().optional(),
  tanggal_lahir: Joi.date().utc().format('YYYY-MM-DD').optional(),
  agama: Joi.string().valid('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu').optional(),
  golongan_darah: Joi.string().valid('A', 'AB', 'B', 'O').optional(),
  nomor_telepon: Joi.string().optional(),
  alamat: Joi.string().optional(),
  provinsi: Joi.string().optional(),
  kabupaten_kota: Joi.string().optional(),
  kecamatan: Joi.string().optional(),
  kelurahan: Joi.string().optional(),
});

const getProfileValidation = Joi.string().required();

export {
  updateProfileValidation,
  getProfileValidation,
};
