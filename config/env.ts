import joi from '@hapi/joi';

/**
 * Joi schema to validate environment variables to ensure we don't have
 * undefined variables.
 */
const envSchema = joi
  .object({
    NODE_ENV: joi.string().default('development'),

    JWT_SECRET: joi.string().required(),

    ENABLE_CORS: joi
      .string()
      .required()
      .allow('true', 'false'),

    CORS_WHITELIST: joi.string().optional(),

    API_PORT: joi
      .number()
      .port()
      .default(4000),

    API_HTTPS_PORT: joi
      .number()
      .port()
      .default(8443),

    MONGO_URI: joi
      .string()
      .uri()
      .required(),

    PRIVATE_KEY_PATH: joi.string().required(),
    CERTIFICATE_PATH: joi.string().required(),
    CHAIN_PATH: joi.string().required(),

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
  httpsPort: value.API_HTTPS_PORT as number,
  enableCors: Boolean(value.ENABLE_CORS) as boolean,
  corsWhitelist: (value.CORS_WHITELIST || '').split(','),

  https: {
    privateKey: value.PRIVATE_KEY_PATH as string,
    certificate: value.CERTIFICATE_PATH as string,
    chain: value.CHAIN_PATH as string,
  },

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
