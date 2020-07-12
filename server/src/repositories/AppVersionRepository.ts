import { getManager } from 'typeorm';
import { AppVersion } from '@entities/AppVersion';

export class AppVersionRepository {
    repository = getManager().getRepository(AppVersion);

    async list () {
      return await this.repository.find();
    }

    async get (id: number) {
      return await this.repository
        .createQueryBuilder()
        .leftJoinAndSelect('AppVersion.api', 'AppApi')
        .where({ id })
        .getOne();
    }

    async save (version: AppVersion) {
      return await this.repository.save(version);
    }

    async delete (id: number) {
      return await this.repository.delete(id);
    }
}
