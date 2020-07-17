import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1594993854619
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop column 'provider'
    await queryRunner.dropColumn('appointments', 'provider');

    // Add column 'provider_id' of type 'uuid', 'nullable'
    //
    // Why is 'provider_id' 'nullable'?
    // Because appointments should be left unreferenced when a provider quits the service.
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Now, we need a relationship to state that 'provider_id' should reference a provider, who is a 'user'
    // Its name is going to be 'AppointmentProvider'
    //
    // When a provider leaves the service, all appointments that reference him or her ahould get no relation anymore.
    // However, when he or she has their 'id' updated for some reason, that should 'cascade' to all their respective appointments.
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key 'AppointmentProvider'
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    // Drop column 'provider_id'
    await queryRunner.dropColumn('appointments', 'provider_id');

    // Add column 'provider', of type 'uuid', 'not null'
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
