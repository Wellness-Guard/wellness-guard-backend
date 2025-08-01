import mongoose from 'mongoose';
import knexfile from '../knexfile';
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];
import knex from 'knex';
import { Model } from 'objection';
export const connectionNoSQL = async () => {
     try {
          return await mongoose.connect(
               `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.NOTIFICATION_DB}.fg4jqhu.mongodb.net/?retryWrites=true&w=majority`,
          );
     } catch (err) {
          throw new Error((err as Error).message);
     }
};

export const connectionSQL = async () => {
     try {
          const db = knex(config);
          Model.knex(db);
          return true;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};
