import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TokenTypes } from 'App/Contracts/enums';

export default class extends BaseSchema {
  protected tableName = 'tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('users.id').nullable();
      table.text('token').notNullable();
      table.dateTime('validity_date').notNullable();
      table.integer('count').notNullable();
      table.enum('type', Object.values(TokenTypes)).notNullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
