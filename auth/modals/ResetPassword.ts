import { BadRequestError } from '@oristic/common';
import { ResetPasswords } from '../@types';
import User from './User';
import { Model, Pojo, RelationMappings } from 'objection';

interface ResetPassword extends ResetPasswords {}
class ResetPassword extends Model {
     static get tableName() {
          return 'reset_password';
     }
     static get idColumn() {
          return 'id';
     }
     static get jsonSchema() {
          return {
               type: 'object',
               required: ['token', 'user_id', 'expire'],
               properties: {
                    id: { type: 'integer' },
                    token: { type: 'string' },
                    age: { type: 'number' },
                    user_id: { type: 'number' },
                    created_at: { type: 'string', format: 'date' },
                    expire: { type: 'string', format: 'date-time' },
               },
          };
     }
     static relationMappings: RelationMappings = {
          user: {
               relation: Model.BelongsToOneRelation,
               modelClass: User,
               join: {
                    from: 'reset_password.user_id',
                    to: 'users.id',
               },
          },
     };

     $formatJson(json: Pojo): Pojo {
          json = super.$formatJson(json);
          delete json.id;
          return json;
     }

     static async createResetPassword(user_id: number, token: string) {
          try {
               const expiration_time = new Date();
               expiration_time.setHours(expiration_time.getHours() + 2);
               console.log('expiration time', expiration_time);
               const result = await ResetPassword.query().insert({ user_id, token, expire: expiration_time.toISOString() });
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async deleteResetPassword(user_id: number) {
          try {
               const result = await ResetPassword.query().delete().where('user_id', user_id);
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async verifyResetToken(token: string) {
          try {
               const currentTime = new Date();
               const result = await ResetPassword.query().select('*').where('token', token).where('expire', '>', currentTime);

               if (result && result.length > 0) {
                    return result;
               } else {
                    return null;
               }
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

export default ResetPassword;
