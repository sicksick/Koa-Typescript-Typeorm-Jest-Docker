import { MigrationInterface, QueryRunner } from "typeorm";

export class seedRoles1548632879221 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.query(`INSERT INTO "group" ("id","name") VALUES (DEFAULT, 'admin');`);
    await queryRunner.query(`INSERT INTO "group" ("id","name") VALUES (DEFAULT, 'user');`);

  }

  public async down(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.query(`TRUNCATE "group" CASCADE `);

  }

}
