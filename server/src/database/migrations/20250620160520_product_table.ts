import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table
      .integer('category_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.decimal('original_price', 10, 2).notNullable();
    table.decimal('rating', 3, 1).notNullable().defaultTo(0);
    table.integer('review_count').notNullable().defaultTo(0);
    table.boolean('in_stock').notNullable().defaultTo(true);
    table.integer('stock_quantity').notNullable().defaultTo(0);
    table.string('brand', 100).notNullable();
    table.string('sku', 50).notNullable();
    table.jsonb('images').notNullable().defaultTo('[]');
    table.jsonb('features').notNullable().defaultTo('[]');
    table.jsonb('specifications').notNullable().defaultTo('{}');
    table.jsonb('colors').notNullable().defaultTo('[]');
    table.jsonb('sizes').notNullable().defaultTo('[]');
    table.string('badge', 50).nullable();
    table.string('badge_variant', 50).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}
