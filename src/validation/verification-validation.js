import Joi from 'joi';

const verifValidation = Joi.object({
  status_verifikasi: Joi.string().valid('accepted', 'rejected').required(),
  alasan_ditolak: Joi.string().when('status_verifikasi', {
    is: 'rejected',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(''),
  }),
});

export default verifValidation;
