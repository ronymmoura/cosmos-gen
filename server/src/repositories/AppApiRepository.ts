import { getManager } from 'typeorm';
import { AppApi } from '@entities/AppApi';

export class AppApiRepository {
    repository = getManager().getRepository(AppApi);

    async list () {
      return await this.repository.find();
    }

    async get (id: number) {
      return this.repository
        .createQueryBuilder()
        .leftJoinAndSelect('AppApi.app', 'App')
        .where({ id })
        .getOne();
    }

    async save (api: AppApi) {
      return await this.repository.save(api);
    }

    async delete (id: number) {
      return await this.repository.delete(id);
    }
}
