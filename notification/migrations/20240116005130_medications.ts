import type { Knex } from 'knex';
const table_name = 'medications';

export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable(table_name, (table) => {
          table.string('medication_id').unique().primary();
          table.integer('user_id').notNullable();
          table.string('name').notNullable();
          table.string('status').notNullable().defaultTo('Created');
          table.timestamp('start_date').notNullable();
          table.timestamp('end_date').notNullable();
          table.integer('days').notNullable();
          table.json('doses').defaultTo([]);
          table.string('disease').notNullable();
          table.timestamp('morning_dose_time').nullable();
          table.timestamp('afternoon_dose_time').nullable();
          table.timestamp('evening_dose_time').nullable();
     });
}

export async function down(knex: Knex): Promise<void> {
     return knex.schema.dropTable(table_name);
}
