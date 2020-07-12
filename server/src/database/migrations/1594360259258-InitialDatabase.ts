import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabase1594360259258 implements MigrationInterface {
    name = 'InitialDatabase1594360259258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isActive" boolean NOT NULL, "icon" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isActive" boolean NOT NULL, "code" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "creationDate" datetime NOT NULL, "activationDate" datetime, "avatar" varchar NOT NULL, "password" varchar NOT NULL, "isActive" boolean NOT NULL, "activationToken" varchar, "userTypeId" integer)`);
        await queryRunner.query(`CREATE TABLE "app" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "userId" integer, "appTypeId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "creationDate" datetime NOT NULL, "activationDate" datetime, "avatar" varchar NOT NULL, "password" varchar NOT NULL, "isActive" boolean NOT NULL, "activationToken" varchar, "userTypeId" integer, CONSTRAINT "FK_29f29dffce2845a1abc901d4e85" FOREIGN KEY ("userTypeId") REFERENCES "user_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "creationDate", "activationDate", "avatar", "password", "isActive", "activationToken", "userTypeId") SELECT "id", "name", "email", "creationDate", "activationDate", "avatar", "password", "isActive", "activationToken", "userTypeId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_app" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "userId" integer, "appTypeId" integer, CONSTRAINT "FK_3f5b0899ef90527a3462d7c2cb3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5f8383828ed8daab032dd82b4c5" FOREIGN KEY ("appTypeId") REFERENCES "app_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_app"("id", "name", "image", "userId", "appTypeId") SELECT "id", "name", "image", "userId", "appTypeId" FROM "app"`);
        await queryRunner.query(`DROP TABLE "app"`);
        await queryRunner.query(`ALTER TABLE "temporary_app" RENAME TO "app"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" RENAME TO "temporary_app"`);
        await queryRunner.query(`CREATE TABLE "app" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "userId" integer, "appTypeId" integer)`);
        await queryRunner.query(`INSERT INTO "app"("id", "name", "image", "userId", "appTypeId") SELECT "id", "name", "image", "userId", "appTypeId" FROM "temporary_app"`);
        await queryRunner.query(`DROP TABLE "temporary_app"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "creationDate" datetime NOT NULL, "activationDate" datetime, "avatar" varchar NOT NULL, "password" varchar NOT NULL, "isActive" boolean NOT NULL, "activationToken" varchar, "userTypeId" integer)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "email", "creationDate", "activationDate", "avatar", "password", "isActive", "activationToken", "userTypeId") SELECT "id", "name", "email", "creationDate", "activationDate", "avatar", "password", "isActive", "activationToken", "userTypeId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "app"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_type"`);
        await queryRunner.query(`DROP TABLE "app_type"`);
    }

}
