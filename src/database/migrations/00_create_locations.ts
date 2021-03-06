import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id').unique().primary();
    table.string('name').notNullable();
    table.string('image').notNullable();
    table.string('email').unique().notNullable();
    table.string('whatsapp').notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.string('city').notNullable();
    table.string('uf').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('locations');
}
