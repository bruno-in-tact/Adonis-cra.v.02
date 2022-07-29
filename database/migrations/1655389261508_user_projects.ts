import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'user_project';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('users.id');
      table.integer('project_id').unsigned().notNullable().references('projects.id');
      table.float('day_passed');
      table.dateTime('day_date');
      table.boolean('is_deleted').defaultTo(false);
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
