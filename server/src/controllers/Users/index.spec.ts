import supertest from 'supertest';
import path from 'path';
import { getRepository } from 'typeorm';

import app from '@src/app';
import { User } from '@entities/User';
import connection from '@database/connection';
import { UserTypeSeed } from '@database/seeds/UserTypeSeed';
import { UserType } from '@entities/UserType';

const request = supertest(app);

const mockData = {
  name: 'Test',
  email: 'test@test.com',
  password: '123',
  userTypeId: 1
};

const mockDataEdited = {
  name: 'Test 2',
  email: 'test2@test.com',
  userTypeId: 2
}

var mockDataID = 0;

describe('UsersController', () => {
  beforeAll(async () => {
    await connection.create();

    await getRepository(UserType).save(UserTypeSeed);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a new user', async done => {
    const res = await request.post('/users')
      .attach('avatar', path.join(__dirname, 'imageTest.jpg'))
      .field('name', mockData.name)
      .field('email', mockData.email)
      .field('password', mockData.password)
      .field('userTypeId', mockData.userTypeId);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  it('should list users', async done => {
    const res = await request.get('/users');

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  it('should get an user', async done => {
    const res = await request.get(`/users/${mockDataID}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(mockDataID);

    done();
  });

  it('should edit an user', async done => {
    const res = await request.put('/users')
      .attach('avatar', path.join(__dirname, 'imageTest.jpg'))
      .field('id', mockDataID)
      .field('name', mockDataEdited.name)
      .field('email', mockDataEdited.email)
      .field('userTypeId', mockDataEdited.userTypeId);

    expect(res.status).toBe(200);

    const res2 = await request.get(`/users/${mockDataID}`);

    const user = res2.body as User;

    expect(res2.status).toBe(200);
    expect(user).toBeTruthy();
    expect(user.id).toEqual(mockDataID);
    expect(user.name).toEqual(mockDataEdited.name);
    expect(user.email).toEqual(mockDataEdited.email);
    expect(user.userType.id).toEqual(mockDataEdited.userTypeId);

    done();
  });

  it('should validate if old password match', async done => {
    const res = await request.put('/users/updatePassword')
      .send({
        id: mockDataID,
        oldPassword: 'asd',
        newPassword: '123456'
      });

    expect(res.status).toBe(500);

    done();
  });

  it('should update the password', async done => {
    const res = await request.put('/users/updatePassword')
      .send({
        id: mockDataID,
        oldPassword: mockData.password,
        newPassword: '123456'
      });

    expect(res.status).toBe(200);

    done();
  });

  it('should delete an user', async done => {
    const res = await request.delete(`/users/${mockDataID}`);

    expect(res.status).toBe(200);

    done();
  });
});
