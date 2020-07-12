import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '@src/app';
import { AppType } from '@entities/AppType';
import connection from '@database/connection';
import { AppTypeSeed } from '@database/seeds/AppTypeSeed';

const request = supertest(app);

describe('AppTypesController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(AppType).save(AppTypeSeed);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should list app types', async done => {
    const res = await request.get('/appTypes');

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[0].id).toEqual(1);

    done();
  });

  it('should get an app type', async done => {
    const res = await request.get('/appTypes/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(1);

    done();
  });
});
