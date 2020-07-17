import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '@src/app';
import connection from '@database/connection';
import { User } from '@entities/User';
import { UserSeed } from '@database/seeds/UserSeed';

const request = supertest(app);

var token = '';

describe('SessionController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(User).save(UserSeed);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should login', async (done) => {
    const res = await request.post('/session/login').send({
      email: 'test@test.com',
      password: '123'
    });

    expect(res.status).toBe(200);
    expect(res.body.auth).toBe(true);

    token = res.body.token;

    done();
  });

  it('should get logged user', async (done) => {
    const res = await request.get('/session').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);

    done();
  });

  it('should unauthorize invalid tokens', async (done) => {
    const res = await request.get('/session').set('Authorization', 'Bearer 123');

    expect(res.status).toBe(401);
    done();
  });

  it('should unauthorize invalid credentials', async (done) => {
    const res = await request.post('/session/login').send({
      email: 'test@test.com',
      password: '123456'
    });

    expect(res.status).toBe(401);
    done();
  });
});
