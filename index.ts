import './config/modules-aliases';

(async (): Promise<void> => {
  // eslint-disable-next-line no-underscore-dangle
  global.__sentryRootDir = __dirname || process.cwd();

  const dotenv = await import('dotenv').then((pkg) => pkg.default);

  dotenv.config();

  const sentry = await import('./config/sentry').then((pkg) => pkg.default);

  sentry.init();

  const mongo = await import('./config/mongo').then((pkg) => pkg.default);

  await mongo.init();

  const app = await import('./config/express').then((pkg) => pkg.default);

  app.init();
})();
