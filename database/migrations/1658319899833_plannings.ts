import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'plannings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_project_id').unsigned().notNullable().references('id').inTable('user_projects')
      table.dateTime('day_date').notNullable()
      table.float('day_quantity').notNullable()
      table.boolean('is_deleted').nullable().defaultTo(false)
  
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
