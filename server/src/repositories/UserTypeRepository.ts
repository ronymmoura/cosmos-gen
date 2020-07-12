import { getManager } from 'typeorm';
import { UserType } from '@entities/UserType';

export class UserTypeRepository {
    repository = getManager().getRepository(UserType);

    async list () {
      return await this.repository.find();
    }

    async get (id: number) {
      return await this.repository.findOne(id);
    }
}
