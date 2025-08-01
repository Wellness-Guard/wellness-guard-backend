import type { Knex } from 'knex';
const table_name = 'tracks';
const relation_table = 'medications';
export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable(table_name, (table) => {
          table.increments('id').primary();
          table.string('medication_id');
          table.timestamp('date').notNullable();
          table.boolean('taken').notNullable();
          table.string('routine').notNullable();
          table.foreign('medication_id').references('medication_id').inTable(relation_table).onUpdate('CASCADE').onDelete('CASCADE');
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.dropTable(table_name);
}
