import ResponseError from '../utils/response-error.js';
import { updateProfileValidation } from '../validation/profile-validation.js';
import validate from '../validation/validation.js';
import { editProfile, findAllProfilesByUser, findProfileByUser } from './profile.repository.js';
import { formatDate } from '../utils/date-format.js';

const getAllProfiles = async (userId) => {
  const profiles = await findAllProfilesByUser(userId);

  return {
    id: profiles.id,
    gelar_depan: profiles.gelar_depan,
    gelar_belakang: profiles.gelar_belakang,
    tempat_lahir: profiles.tempat_lahir,
    tanggal_lahir: profiles.tanggal_lahir ? formatDate(profiles.tanggal_lahir) : null,
    jenis_kelamin: profiles.jenis_kelamin,
    agama: profiles.agama,
    golongan_darah: profiles.golongan_darah,
    nomor_telepon: profiles.nomor_telepon,
    alamat: profiles.alamat,
    provinsi: profiles.provinsi,
    kabupaten_kota: profiles.kabupaten_kota,
    kecamatan: profiles.kecamatan,
    kelurahan: profiles.kelurahan,
    user: {
      nama: profiles.user.nama,
    },
  };
};

const updateProfile = async (profileData, userId) => {
  const profileValidation = await validate(updateProfileValidation, profileData);
  const profileByUser = await findProfileByUser(userId);

  if (!profileByUser) {
    throw new ResponseError(404, 'Profile not found');
  }

  const profile = await editProfile(profileValidation, userId);

  return {
    id: profile.id,
    gelar_depan: profile.gelar_depan,
    gelar_belakang: profile.gelar_belakang,
    tempat_lahir: profile.tempat_lahir,
    tanggal_lahir: profile.tanggal_lahir ? formatDate(profile.tanggal_lahir) : profileByUser.tanggal_lahir,
    jenis_kelamin: profile.jenis_kelamin,
    agama: profile.agama,
    golongan_darah: profile.golongan_darah,
    status_kepegawaian: profile.status_kepegawaian,
    nomor_telepon: profile.nomor_telepon,
    alamat: profile.alamat,
    provinsi: profile.provinsi,
    kabupaten_kota: profile.kabupaten_kota,
    kecamatan: profile.kecamatan,
    kelurahan: profile.kelurahan,
  };
};

export {
  getAllProfiles,
  updateProfile,
};
