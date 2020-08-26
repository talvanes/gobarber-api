import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarFieldToUsers1595427231703
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add Column 'avatar' of type 'varchar', 'nullable'
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop column 'avatar'
    await queryRunner.dropColumn('users', 'avatar');
  }
}
