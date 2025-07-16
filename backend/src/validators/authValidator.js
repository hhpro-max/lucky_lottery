const Joi = require('joi');

exports.signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(100).required(),
  dob: Joi.date().iso().required(),
  address: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}); 