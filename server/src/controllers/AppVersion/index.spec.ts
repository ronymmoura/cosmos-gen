import supertest from 'supertest';
import path from 'path';
import { getRepository } from 'typeorm';

import app from '@src/app';
import connection from '@database/connection';
import { UserTypeSeed } from '@database/seeds/UserTypeSeed';
import { UserType } from '@entities/UserType';
import { AppType } from '@entities/AppType';
import { AppTypeSeed } from '@database/seeds/AppTypeSeed';
import { User } from '@entities/User';
import { UserSeed } from '@database/seeds/UserSeed';
import { App } from '@entities/App';
import { AppSeed } from '@database/seeds/AppSeed';
import { AppVersion } from '@entities/AppVersion';
import { AppApi } from '@entities/AppApi';
import { AppApiSeed } from '@database/seeds/AppApiSeed';
import { login } from '@helpers/tests';

const request = supertest(app);

var token = '';

const mockData = {
  version: '1.0.0',
  apiId: 1
};

const mockDataEdited = {
  version: '1.0.1',
  apiId: 1
}

var mockDataID = 0;

describe('AppVersionsController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(UserType).save(UserTypeSeed);
    await getRepository(AppType).save(AppTypeSeed);
    await getRepository(App).save(AppSeed);
    await getRepository(AppApi).save(AppApiSeed);

    token = await login();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a new version', async done => {
    const res = await request
      .post('/appVersions')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'fileTest.txt'))
      .field('version', mockData.version)
      .field('apiId', mockData.apiId);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  it('should list versions', async done => {
    const res = await request
      .get('/appVersions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  it('should get a version', async done => {
    const res = await request
      .get(`/appVersions/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(mockDataID);

    done();
  });

  it('should edit a version', async done => {
    const res = await request
      .put('/appVersions')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'fileTest.txt'))
      .field('id', mockDataID)
      .field('version', mockDataEdited.version)
      .field('apiId', mockDataEdited.apiId);

    expect(res.status).toBe(200);

    const res2 = await request
      .get(`/appVersions/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    const version = res2.body as AppVersion;

    expect(res2.status).toBe(200);
    expect(version).toBeTruthy();
    expect(version.id).toEqual(mockDataID);
    expect(version.version).toEqual(mockDataEdited.version);
    expect(version.api.id).toEqual(mockDataEdited.apiId);

    done();
  });

  it('should delete a version', async done => {
    const res = await request
      .delete(`/appVersions/${mockDataID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    done();
  });
});
