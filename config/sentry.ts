import * as Sentry from '@sentry/node';
import * as Integrations from '@sentry/integrations';

import env from './env';

/**
 * Initialize Sentry only if `SENTRY_DSN` environment variable is present.
 */
export default {
  init: (): void => {
    if (env.sentry.DSN && env.nodeEnv === 'production') {
      Sentry.init({
        dsn: env.sentry.DSN,
        release: env.sentry.release,
        integrations: [
          new Integrations.RewriteFrames({
            // eslint-disable-next-line no-underscore-dangle
            root: global.__sentryRootDir,
          }),
        ],
      });
    }
  },
};
