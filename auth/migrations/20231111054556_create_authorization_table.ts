import { Knex } from 'knex';
import { Mode } from '../@types';
const table_name = 'users';

export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable(table_name, (table) => {
          table.increments('id').primary();
          table.string('email', 100).unique().notNullable();
          table.string('password').nullable();
          table.boolean('verify').nullable().defaultTo(false);
          table.enu('mode', [Mode.Email, Mode.Facebook, Mode.Gmail]).notNullable().defaultTo('email');
          table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
          table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.dropTable(table_name);
}
