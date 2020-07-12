import { getManager } from 'typeorm';
import { App } from '@entities/App';

export class AppRepository {
    repository = getManager().getRepository(App);

    async list () {
      return await this.repository.find();
    }

    async get (id: number) {
      return await this.repository
        .createQueryBuilder()
        .leftJoinAndSelect('App.user', 'User')
        .leftJoinAndSelect('App.appType', 'AppType')
        .where({ id })
        .getOne();
    }

    async insert (app: App) {
      return await this.repository.save(app);
    }

    async update (app: App) {
      return await this.repository.save(app);
    }

    async delete (id: number) {
      return await this.repository.delete(id);
    }
}
