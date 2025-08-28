import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('dev', 'prod', 'test', 'provision')
    .default('prod'),

  PORT: Joi.number().port().default(3000),

  FALLBACK_LANGUAGE: Joi.string().valid('en', 'my').default('en'),
});

export const envValidationOptions = {
  allowUnknown: false, // Disallow unknown keys not specified in schema
  abortEarly: true, // Stop validation on the first error
};
