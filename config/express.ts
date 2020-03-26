/*
  eslint
    @typescript-eslint/no-unused-vars: "off",
    @typescript-eslint/no-explicit-any: "off"
*/
import { Server } from 'http';
import express, { NextFunction, Request, Response, Express } from 'express';
import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { errors as celebrateErrorHandler } from 'celebrate';

import { APIError } from '@interfaces/express.interfaces';
import router from '@server/router';
import env from './env';

const app = express();

/**
 * Array of unprotected paths that doesn't require a JWT auth.
 */
const unprotectedPaths: string[] = ['/api/heartbeat', '/api/auth/'];

// Parse body params and attach them to `req.body`
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS (Cross Origin Resource Sharing)
app.use(cors());

// Enable JWT protection but add exceptions on some paths
app.use(expressJwt({ secret: env.secrets.jwt }).unless({ path: unprotectedPaths }));

// Add HTTP request logging to console
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Inject routes under `/api` path
app.use('/api', router);

// Celebrate validation error-handler
app.use(celebrateErrorHandler());

// Custom error-handler middleware for 404 errors
app.use((req, res, next) => {
  const error: APIError = {
    name: 'Not found',
    message: 'The requested resource does not exist',
    status: 404,
    stack: '',
  };

  next(error);
});

// Custom error-handler middleware for various errors (400, 500, ...)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const error: APIError = {
    name: err.name,
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
  };

  next(error);
});

// Error middleware which sends API errors as JSON
app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status).json({
    name: err.name,
    message: err.message,
    stack: env.nodeEnv !== 'production' && err.stack ? err.stack : '',
    status: err.status,
  });
});

export default {
  /**
   * Make the express app listen for connections.
   */
  init: (): { app: Express; server: Server } => {
    const server = app.listen(env.port, () =>
      // eslint-disable-next-line no-console
      console.log(`> REST-API server started on :${env.port}`),
    );

    return {
      app,
      server,
    };
  },
};
