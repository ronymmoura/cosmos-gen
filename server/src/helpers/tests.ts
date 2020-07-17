import supertest from 'supertest';
import app from '@src/app';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';
import { UserSeed } from '@database/seeds/UserSeed';

export const login = async () => {
  await getRepository(User).save(UserSeed);

  const request = supertest(app);

  const res = await request.post('/session/login').send({
    email: 'test@test.com',
    password: '123'
  });

  return res.body.token;
}
