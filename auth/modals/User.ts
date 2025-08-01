import { Model, ModelOptions, Pojo, QueryContext, RelationMappings } from 'objection';
import { Password } from '../services/password';
import { Mode, Users } from '../@types';
import Profile from './Profile';
import { BadRequestError } from '@oristic/common';
// mergin similar types
interface User extends Users {}
class User extends Model {
     static get tableName() {
          return 'users';
     }
     static get idColumn() {
          return 'id';
     }
     static get jsonSchema() {
          return {
               type: 'object',
               required: ['email'],
               properties: {
                    id: { type: 'integer' },
                    email: { type: 'string', maxLength: 100 },
                    password: { type: ['string', 'null'] },
                    verify: { type: 'boolean' },
                    mode: { type: 'string' },
                    created_at: { type: 'string', format: 'date' },
                    updated_at: { type: 'string', format: 'date' },
                    code: { type: 'integer' },
                    expire: { type: 'string', format: 'date-time' },
               },
          };
     }

     async $beforeInsert(queryContext: QueryContext) {
          await super.$beforeInsert(queryContext);
          if (this.password) this.password = await Password.toHash(this.password!);
     }
     async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
          await super.$beforeUpdate(opt, queryContext);
          if (this.password) this.password = await Password.toHash(this.password!);
     }

     $formatJson(json: Pojo): Pojo {
          json = super.$formatJson(json);
          delete json.password;
          delete json.mode;
          return json;
     }

     static relationMappings: RelationMappings = {
          profile: {
               relation: Model.HasOneRelation,
               modelClass: Profile,
               join: {
                    from: 'users.id',
                    to: 'profiles.user_id',
               },
          },
     };

     static async createCode(id: number) {
          try {
               const expiration_time = new Date();
               expiration_time.setMinutes(expiration_time.getMinutes() + 2);
               const code = Math.floor(Math.random() * 90000) + 10000;
               await User.query().findOne({ id }).patch({ code, expire: expiration_time.toISOString() });
               return code;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async findEmail(email: string) {
          try {
               const result = (await User.query().findOne({ email: email })) || null;
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async findProfile(id: number, email: string) {
          const profile = await User.relatedQuery<Profile>('profile').for(id);
          const { first_name, last_name } = profile[0];
          return {
               id,
               first_name,
               last_name,
               email,
          };
     }

     static async createUserProfile(first_name: string, last_name: string, email: string, avatar: string, mode: Mode) {
          try {
               return await User.transaction(async (trx) => {
                    const user = await User.query(trx).insert({ email: email, verify: true, mode: mode });
                    const profile = await user.$relatedQuery<Profile>('profile', trx).insert({ first_name, last_name, avatar: avatar });
                    return { first_name: profile.first_name, last_name: profile.last_name, id: user.id, email: user.email };
               });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }

     static async findOrCreate(first_name: string, last_name: string, email: string, avatar: string, mode: Mode) {
          try {
               const user = await User.query().findOne({ email });
               console.log('Found', user);
               if (user === undefined) {
                    // make tranaction
                    return await this.createUserProfile(first_name, last_name, email, avatar, mode);
               }
               const { id } = user!;
               return await this.findProfile(id, email);
          } catch (error) {
               throw new BadRequestError((error as Error).message);
          }
     }
     static async updatePassword(id: number, password: string) {
          try {
               const updatePassword = await User.query().findOne({ id }).patch({ password });
               return updatePassword;
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }

     static async verifyCode(id: number, code: number) {
          try {
               const currentTime = new Date();
               const result = await User.query().select('*').where('id', id).where('code', code).where('expire', '>', currentTime);
               // update fields as well
               if (result && result.length > 0) {
                    console.log('Result', result);
                    const updated = await User.query().findOne({ id }).patch({ verify: true });
                    console.log('updated', updated);
               }
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

export default User;
