import { getManager } from 'typeorm';
import { User } from '@entities/User';
import constants from '@config/constants';
import crypto from 'crypto';

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
      const encryptedPassword = crypto.createHmac('sha256', constants.salt).update(user.password).digest('hex');
      user.password = encryptedPassword;

      return await this.repository.save(user);
    }

    async update (user: User) {
      return await this.repository.save(user);
    }

    async delete (id: number) {
      return await this.repository.delete(id);
    }
}
