import joi from '@hapi/joi';

/**
 * Joi schema to validate environment variables to ensure we don't have
 * undefined variables.
 */
const envSchema = joi
  .object({
    NODE_ENV: joi.string().default('development'),

    JWT_SECRET: joi.string().required(),

    API_PORT: joi
      .number()
      .port()
      .default(4000),

    MONGO_URI: joi
      .string()
      .uri()
      .required(),

    SENTRY_DSN: joi
      .string()
      .uri()
      .optional(),
    SENTRY_RELEASE: joi.string().optional(),
    SENTRY_TOKEN: joi.string().optional(),
    SENTRY_ORG: joi.string().optional(),
    SENTRY_PROJECT: joi.string().optional(),
  })
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error && process.env.NODE_ENV !== 'test') {
  throw new Error(`Config validation errors, please check the .env file: ${error.message}`);
}

export default {
  nodeEnv: value.NODE_ENV as string,
  port: value.API_PORT as number,

  mongo: {
    uri: value.MONGO_URI as string,
  },

  sentry: {
    DSN: value.SENTRY_DSN as string | undefined,
    release: value.SENTRY_RELEASE as string | undefined,
    org: value.SENTRY_ORG as string | undefined,
    project: value.SENTRY_PROJECT as string | undefined,
  },

  secrets: {
    jwt: value.JWT_SECRET as string,
  },
};
