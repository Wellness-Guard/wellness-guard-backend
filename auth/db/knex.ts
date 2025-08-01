import knexfile from '../knexfile';
import knex from 'knex';
import { Model } from 'objection';
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];
import { DataBaseConnectionError } from '@oristic/common';
export const setupDB = async () => {
     try {
          const db = knex(config);
          Model.knex(db);
          return db;
     } catch (e) {
          throw new DataBaseConnectionError();
     }
};
