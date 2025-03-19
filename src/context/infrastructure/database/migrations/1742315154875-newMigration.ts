import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1742315154875 implements MigrationInterface {
  name = 'NewMigration1742315154875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`company_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cuit\` text NOT NULL, \`businessName\` text NOT NULL, \`adhesionDate\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transfer_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`companyId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`debitAccount\` varchar(20) NOT NULL, \`creditAccount\` varchar(20) NOT NULL, \`transferDate\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transfer_entity\` ADD CONSTRAINT \`FK_d6a66485895accfca58e4c8443c\` FOREIGN KEY (\`companyId\`) REFERENCES \`company_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transfer_entity\` DROP FOREIGN KEY \`FK_d6a66485895accfca58e4c8443c\``,
    );
    await queryRunner.query(`DROP TABLE \`transfer_entity\``);
    await queryRunner.query(`DROP TABLE \`company_entity\``);
  }
}
