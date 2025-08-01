import type { Knex } from 'knex';
const table_name = 'users';

export async function up(knex: Knex): Promise<void> {
     return knex.schema.table(table_name, (table) => {
          table.integer('code').nullable();
          table.timestamp('expire').nullable();
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.table(table_name, (table) => {
          table.dropColumn('token');
          table.dropColumn('expire');
     });
}
