import supertest from 'supertest';

import app from '@src/app';
import connection from '@database/connection';
import { getRepository } from 'typeorm';

import { UserType } from '@entities/UserType';
import { AppType } from '@entities/AppType';

import { UserTypeSeed } from '@database/seeds/UserTypeSeed';
import { AppTypeSeed } from '@database/seeds/AppTypeSeed';
import { AppSeed } from '@database/seeds/AppSeed';
import { AppApi } from '@entities/AppApi';
import { App } from '@entities/App';
import { User } from '@entities/User';
import { UserSeed } from '@database/seeds/UserSeed';
import { login } from '@helpers/tests';

const request = supertest(app);

var token = '';

const mockData = {
  name: 'Homolog',
  url: 'http://10.10.170.11/Api',
  isActive: true,
  appId: 1
};

const mockDataEdited = {
  id: 1,
  name: 'Homolog 2',
  isActive: false,
  url: 'http://10.10.170.11/Api 2'
}

var mockDataID = 0;

describe('AppApisController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(UserType).save(UserTypeSeed);
    await getRepository(AppType).save(AppTypeSeed);
    await getRepository(App).save(AppSeed);

    token = await login();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a new api', async done => {
    const res = await request
      .post('/appApis')
      .set('Authorization', `Bearer ${token}`)
      .send(mockData);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  it('should list apis', async done => {
    const res = await request
      .get('/appApis')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  it('should get an app', async done => {
    const res = await request
      .get(`/appApis/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(mockDataID);

    done();
  });

  it('should edit an api', async done => {
    const res = await request
      .put('/appApis')
      .set('Authorization', `Bearer ${token}`)
      .send(mockDataEdited);

    expect(res.status).toBe(200);

    const res2 = await request
      .get(`/appApis/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    const api = res2.body as AppApi;

    expect(res2.status).toBe(200);
    expect(app).toBeTruthy();
    expect(api.id).toEqual(mockDataID);
    expect(api.name).toEqual(mockDataEdited.name);
    expect(api.url).toEqual(mockDataEdited.url);
    expect(api.isActive).toEqual(mockDataEdited.isActive);
    expect(api.app.id).toEqual(mockData.appId);

    done();
  });

  it('should delete an app', async done => {
    const res = await request
      .delete(`/appApis/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    done();
  });
});
