import type { Knex } from 'knex';
const table_name = 'reset_password';
const reference_table = 'users';

export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable(table_name, (table) => {
          table.increments('id').primary();
          table.string('token').notNullable();
          table.integer('user_id').unsigned().notNullable();
          table.foreign('user_id').references('id').inTable(reference_table);
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('expire').notNullable();
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.dropTableIfExists(table_name);
}
