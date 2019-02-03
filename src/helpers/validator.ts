import CustomError from './error';

const Joi = require('joi');

export async function joiValidate(data: any, schema: any) {
  Joi.validate(data, schema, (err) => {
    if (err) {
      throw new CustomError(422, {
        error: err.details[0].message.replace(/\"/g, '\'')
      });
    }
  });
}

export const userLoginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
};

export const userRegistrationSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
};
