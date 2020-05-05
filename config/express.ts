/*
  eslint
    @typescript-eslint/no-unused-vars: "off",
    @typescript-eslint/no-explicit-any: "off"
*/
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express, { NextFunction, Request, Response, Express } from 'express';
import expressJwt from 'express-jwt';
import rateLimit from 'express-rate-limit';
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
 * List of website to whitelist for CORS. Pull values from `.env` file.
 */
const corsWhitelist: string[] = [...env.corsWhitelist];

/**
 * Array of unprotected paths that doesn't require a JWT auth.
 */
const unprotectedPaths: string[] = ['/api/heartbeat', '/api/auth/'];

/**
 * Options for `express-rate-limit`.
 */
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 30,
});

// Load SSL keys for HTTPS
let sslPrivateKey: Buffer | null = null;
let sslCertificate: Buffer | null = null;
let sslChain: Buffer | null = null;

if (env.nodeEnv === 'production') {
  sslPrivateKey = fs.readFileSync(path.join(env.https.privateKey));
  sslCertificate = fs.readFileSync(path.join(env.https.certificate));
  sslChain = fs.readFileSync(path.join(env.https.chain));
}

// Parse body params and attach them to `req.body`
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS (Cross Origin Resource Sharing)
app.use(
  cors({
    origin: (origin, cb) => {
      // Enable CORS only on production and verify if the origin is in the
      // whitelist.
      if (env.nodeEnv !== 'production' || (origin && corsWhitelist.includes(origin))) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed due to CORS restrictions'));
      }
    },
  }),
);

// Enable CORS (Cross Origin Resource Sharing)
app.use(cors());

// Enable JWT protection but add exceptions on some paths
app.use(expressJwt({ secret: env.secrets.jwt }).unless({ path: unprotectedPaths }));

// Enable Express rate-limit middleware
app.use(limiter);

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
   * Create HTTP and HTTPS (optional) servers with Express app instance.
   */
  init: (): { app: Express; httpServer: http.Server; httpsServer: https.Server | null } => {
    const httpServer = http.createServer(app);

    let httpsServer: https.Server | null = null;

    if (env.nodeEnv === 'production' && sslPrivateKey && sslCertificate && sslChain) {
      httpsServer = https.createServer(
        {
          key: sslPrivateKey,
          cert: sslCertificate,
          ca: sslChain,
        },
        app,
      );

      httpsServer.listen(env.httpsPort);

      // eslint-disable-next-line no-console
      console.log(`> REST-API HTTPS server started on :${env.httpsPort}`);
    }

    httpServer.listen(env.port);

    // eslint-disable-next-line no-console
    console.log(`> REST-API HTTP server started on :${env.port}`);

    return { app, httpServer, httpsServer };
  },
};
