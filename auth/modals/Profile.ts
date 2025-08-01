import { BadRequestError } from '@oristic/common';
import { Profiles } from '../@types';
import User from './User';
import { Model, Pojo, RelationMappings } from 'objection';

interface Profile extends Profiles {}
class Profile extends Model {
     static get tableName() {
          return 'profiles';
     }
     static get idColumn() {
          return 'id';
     }
     static get jsonSchema() {
          return {
               type: 'object',
               required: ['first_name', 'last_name'],
               properties: {
                    id: { type: 'integer' },
                    first_name: { type: 'string', maxLength: 64 },
                    last_name: { type: 'string', maxLength: 64 },
                    gender: { type: 'string', maxLength: 6 },
                    date_of_birth: { type: 'string', format: 'date' },
                    age: { type: 'number' },
                    user_id: { type: 'number' },
                    avatar: { type: 'string' },
                    created_at: { type: 'string', format: 'date' },
                    updated_at: { type: 'string', format: 'date' },
               },
          };
     }
     static relationMappings: RelationMappings = {
          user: {
               relation: Model.BelongsToOneRelation,
               modelClass: User,
               join: {
                    from: 'profiles.user_id',
                    to: 'users.id',
               },
          },
     };

     $formatJson(json: Pojo): Pojo {
          json = super.$formatJson(json);
          delete json.user_id;
          return json;
     }

     static async profileRecord(user_id: number) {
          try {
               const profile = await Profile.query().findOne({ user_id });
               if (profile) {
                    return profile;
               }
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }

     static async updateProfileRecord(user_id: number, first_name: string, last_name: string, gender: string, date_of_birth: Date, avatar: string) {
          try {
               const updatedProfile = await Profile.query()
                    .findOne({ user_id })
                    .patch({ first_name, last_name, gender, date_of_birth, avatar })
                    .returning('*');

               return updatedProfile;
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }

     static async updateAvatar(user_id: number, avatar: string) {
          try {
               const result = await Profile.query().findOne({ user_id }).patch({ avatar: avatar }).returning('avatar');
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

export default Profile;
