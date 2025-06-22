import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('description', 255).notNullable();
    table.string('image', 255).nullable();
    table.integer('item_count').notNullable().defaultTo(0);
    table.string('color', 50).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('categories');
}
