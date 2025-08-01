import type { Knex } from 'knex';
import env from 'dotenv';
env.config({ path: '.././.env' });
const config: { [key: string]: Knex.Config } = {
     development: {
          client: 'pg',
          connection: {
               database: process.env.NOTIFICATION_DB,
               user: process.env.POSTGRES_USER,
               password: process.env.POSTGRES_PASSWORD,
               host: 'postgres',
               port: 5432,
          },
          migrations: {
               directory: __dirname + '/migrations',
          },
     },

     staging: {
          client: 'postgresql',
          connection: {
               database: 'my_db',
               user: 'username',
               password: 'password',
          },
          pool: {
               min: 2,
               max: 10,
          },
          migrations: {
               tableName: 'knex_migrations',
          },
     },

     production: {
          client: 'pg',
          connection: {
               database: process.env.NOTIFICATION_DB,
               user: process.env.POSTGRES_USER,
               password: process.env.POSTGRES_PASSWORD,
               host: process.env.POSTGRES_HOST,
               port: 5432,
               ssl: {
                    rejectUnauthorized: false,
               },
          },
          migrations: {
               directory: __dirname + '/migrations',
          },
     },
};

export default config;
