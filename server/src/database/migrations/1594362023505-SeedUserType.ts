import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { UserType } from '@entities/UserType';
import { AppType } from '@entities/AppType';
import { UserTypeSeed } from '@database/seeds/UserTypeSeed';
import { AppTypeSeed } from '@database/seeds/AppTypeSeed';

export class SeedUserType1594362023505 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await getRepository(UserType).save(UserTypeSeed);
    await getRepository(AppType).save(AppTypeSeed);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
  }
}
