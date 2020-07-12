import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '@src/app';
import { UserType } from '@entities/UserType';
import connection from '@database/connection';
import { UserTypeSeed } from '@database/seeds/UserTypeSeed';

const request = supertest(app);

describe('UserTypesController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(UserType).save(UserTypeSeed);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should list user types', async done => {
    const res = await request.get('/userTypes');

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[0].id).toEqual(1);

    done();
  });

  it('should get an user type', async done => {
    const res = await request.get('/userTypes/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(1);

    done();
  });
});
