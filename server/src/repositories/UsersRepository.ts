import { getManager } from 'typeorm';
import { User } from '@entities/User';
import jwtConfig from '@config/jwt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class UsersRepository {
  repository = getManager().getRepository(User);

  async list () {
    return await this.repository.find();
  }

  async get (id: number) {
    return await this.repository
      .createQueryBuilder()
      .leftJoinAndSelect('User.userType', 'UserType')
      .where({ id })
      .getOne();
  }

  async insert (user: User) {
    const encryptedPassword = crypto.createHmac('sha256', jwtConfig.secret).update(user.password).digest('hex');
    user.password = encryptedPassword;

    return await this.repository.save(user);
  }

  async update (user: User) {
    return await this.repository.save(user);
  }

  async delete (id: number) {
    return await this.repository.delete(id);
  }

  async login (email: string, password: string) {
    const encryptedPassword = crypto.createHmac('sha256', jwtConfig.secret).update(password).digest('hex');

    const user = await this.repository
      .createQueryBuilder()
      .leftJoinAndSelect('User.userType', 'UserType')
      .where({
        email,
        password: encryptedPassword
      })
      .getOne();

    if (!user)
      throw new Error('Email or password is wrong');

    var token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn, // expires in 5min
      algorithm: 'HS256'
    });

    return { auth: true, token };
  }
}
