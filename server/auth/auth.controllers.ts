import { v1 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { APIError } from '@interfaces/express.interfaces';
import env from '@config/env';

const jwtSignOptions: jwt.SignOptions = {
  expiresIn: '7d',
};

/**
 * Generate a JWT for third-party tools using the same JWT secret.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export default (req: Request, res: Response, next: NextFunction): void => {
  const secret = req.body.secret as string;

  if (secret !== env.secrets.jwt) {
    const error: APIError = {
      name: 'Authentication error',
      message: 'Invalid authentication credentials',
      status: 403,
    };

    next(error);
  } else {
    const token = jwt.sign({ id: uuid() }, env.secrets.jwt, jwtSignOptions);

    res.json({ token });
  }
};
