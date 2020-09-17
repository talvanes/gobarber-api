import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1600366392984
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column 'user_id' to 'appointments', of type uuid, nullable
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add foreign key 'AppointmentUser', which references 'id' on table 'users'
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key 'AppointmentUser'
    await queryRunner.dropForeignKey('appointments', 'AppointmentUser');

    // Drop column 'user_id' from 'appointments'
    await queryRunner.dropColumn('appointments', 'user_id');
  }
}
