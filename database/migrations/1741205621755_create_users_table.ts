import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('username').notNullable().unique()
      // table.string('password').notNullable()
      table.string('display_name').nullable()
      table.string('banner_url').notNullable()
      table.string('avatar_url').notNullable()
      table.string('description').nullable()
      table.string('status').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
