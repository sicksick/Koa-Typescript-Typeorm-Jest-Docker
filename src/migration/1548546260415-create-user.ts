import {MigrationInterface, QueryRunner} from "typeorm";

export class createUser1548546260415 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "facebook_id" character varying, "google_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_group" ("user_id" integer NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "PK_9ebb6f93454a3cf76be48b53f96" PRIMARY KEY ("user_id", "group_id"))`);
        await queryRunner.query(`ALTER TABLE "users_group" ADD CONSTRAINT "FK_10a11fa9a18f7bdb2cd07b623d1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_group" ADD CONSTRAINT "FK_b396c521b1442ea6d8fd418b1e6" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users_group" DROP CONSTRAINT "FK_b396c521b1442ea6d8fd418b1e6"`);
        await queryRunner.query(`ALTER TABLE "users_group" DROP CONSTRAINT "FK_10a11fa9a18f7bdb2cd07b623d1"`);
        await queryRunner.query(`DROP TABLE "users_group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
