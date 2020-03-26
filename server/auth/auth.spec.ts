import { Server } from 'http';
import { Express } from 'express';
import request from 'supertest';

import env from '@config/env';
import express from '@config/express';

describe('Auth endpoints tests', () => {
  let app: Express;
  let server: Server;

  beforeEach(() => {
    const initialized = express.init();

    app = initialized.app;
    server = initialized.server;
  });

  afterEach(() => {
    server.close();
  });

  test('reject authorization if no body is sent', async () => {
    const res = await request(app).post('/api/auth/');

    expect(res.status).toEqual(400);
  });

  test('reject authorization if using an invalid JWT secret', async () => {
    const res = await request(app)
      .post('/api/auth/')
      .send({
        secret: 'invalid-jwt-secret',
      });

    expect(res.status).toEqual(403);
  });

  test('generate a JWT for a valid JWT secret', async () => {
    const res = await request(app)
      .post('/api/auth/')
      .send({
        secret: env.secrets.jwt,
      });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
