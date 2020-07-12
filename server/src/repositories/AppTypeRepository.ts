import { getManager } from 'typeorm';
import { AppType } from '@entities/AppType';

export class AppTypeRepository {
    repository = getManager().getRepository(AppType);

    async list () {
      return await this.repository.find();
    }

    async get (id: number) {
      return await this.repository.findOne(id);
    }
}
