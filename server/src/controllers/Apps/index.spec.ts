import supertest from 'supertest';
import path from 'path';

import app from '@src/app';
import connection from '@database/connection';
import { App } from '@entities/App';
import { getRepository } from 'typeorm';
import { UserType } from '@entities/UserType';
import { UserTypeSeed } from '@database/seeds/UserTypeSeed';
import { AppType } from '@entities/AppType';
import { AppTypeSeed } from '@database/seeds/AppTypeSeed';
import { User } from '@entities/User';
import { UserSeed } from '@database/seeds/UserSeed';
import { login } from '@helpers/tests';

const request = supertest(app);

var token = '';

const mockData = {
  name: 'App 1',
  userId: 1,
  appTypeId: 1
};

const mockDataEdited = {
  name: 'App 2',
  appTypeId: 2
}

var mockDataID = 0;

describe('AppsController', () => {
  beforeAll(async () => {
    await connection.create();
    await getRepository(UserType).save(UserTypeSeed);
    await getRepository(AppType).save(AppTypeSeed);

    token = await login();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a new app', async done => {
    const res = await request
      .post('/apps')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', path.join(__dirname, 'imageTest.jpg'))
      .field('name', mockData.name)
      .field('userId', mockData.userId)
      .field('appTypeId', mockData.appTypeId);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  it('should list apps', async done => {
    const res = await request
      .get('/apps')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  it('should get an app', async done => {
    const res = await request
      .get(`/apps/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(mockDataID);

    done();
  });

  it('should edit an app', async done => {
    const res = await request
      .put('/apps')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', path.join(__dirname, 'imageTest.jpg'))
      .field('id', mockDataID)
      .field('name', mockDataEdited.name)
      .field('appTypeId', mockDataEdited.appTypeId);

    expect(res.status).toBe(200);

    const res2 = await request
      .get(`/apps/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    const app = res2.body as App;

    expect(res2.status).toBe(200);
    expect(app).toBeTruthy();
    expect(app.id).toEqual(mockDataID);
    expect(app.name).toEqual(mockDataEdited.name);
    expect(app.appType.id).toEqual(mockDataEdited.appTypeId);

    done();
  });

  it('should delete an app', async done => {
    const res = await request
      .delete(`/apps/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    done();
  });
});
