import { Knex } from 'knex';
const table_name = 'profiles';
const relation_table = 'users';

export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable(table_name, (table) => {
          table.increments('id').primary();
          table.string('first_name', 64).notNullable();
          table.string('last_name', 64).notNullable();
          table.string('gender', 8).nullable();
          table.date('date_of_birth').nullable();
          table.integer('age').nullable();
          table.string('avatar').nullable().unique();
          table.integer('user_id').notNullable();
          table.foreign('user_id').references('id').inTable(relation_table).onUpdate('CASCADE').onDelete('CASCADE');
          table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
          table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.dropTable(table_name);
}
