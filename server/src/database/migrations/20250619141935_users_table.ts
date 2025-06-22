import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstName').notNullable();
    table.string('lastName');
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('address');
    table.enum('role', ['USER', 'ADMIN']).defaultTo('USER');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
