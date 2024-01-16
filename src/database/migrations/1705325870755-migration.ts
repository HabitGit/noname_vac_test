import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705325870755 implements MigrationInterface {
    name = 'Migration1705325870755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_entity" ("id" SERIAL NOT NULL, "email" character varying(40) NOT NULL, "password" character varying NOT NULL, "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_afcd3ae9dbf45eced5872ca49b0" UNIQUE ("email"), CONSTRAINT "PK_d9b0d3777428b67f460cf8a9b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens_entity" ("id" SERIAL NOT NULL, "refreshToken" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_e332de8bd2f66a71657d1b1356" UNIQUE ("userId"), CONSTRAINT "PK_d2d21b8a4232c0a5322be4d4c84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_entity" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" text NOT NULL, "author" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a6a10795820ebbc0d456729464" UNIQUE ("name"), CONSTRAINT "PK_610e9da00b44406271dafc72660" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tokens_entity" ADD CONSTRAINT "FK_e332de8bd2f66a71657d1b1356b" FOREIGN KEY ("userId") REFERENCES "users_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens_entity" DROP CONSTRAINT "FK_e332de8bd2f66a71657d1b1356b"`);
        await queryRunner.query(`DROP TABLE "posts_entity"`);
        await queryRunner.query(`DROP TABLE "tokens_entity"`);
        await queryRunner.query(`DROP TABLE "users_entity"`);
    }

}
