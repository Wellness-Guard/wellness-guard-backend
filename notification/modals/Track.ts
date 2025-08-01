import { Model, Pojo } from 'objection';
import { TrackInterface } from '../@types/interfaces';
import { RelationMappings } from 'objection';
import Medication from './Medication';
import { BadRequestError } from '@oristic/common';
// mergin similar types
interface Track extends TrackInterface {}
class Track extends Model {
     static get tableName() {
          return 'tracks';
     }
     static get idColumn() {
          return 'id';
     }
     static get jsonSchema() {
          return {
               type: 'object',
               required: ['medication_id', 'date', 'routine', 'taken'],
               properties: {
                    id: { type: 'integer' },
                    medication_id: { type: 'string' },
                    date: { format: 'date-time' },
                    routine: { type: 'string' },
                    taken: { type: 'boolean' },
               },
          };
     }
     $formatJson(json: Pojo): Pojo {
          json = super.$formatJson(json);
          delete json.medication_id;
          return json;
     }
     static relationMappings: RelationMappings = {
          user: {
               relation: Model.BelongsToOneRelation,
               modelClass: Medication,
               join: {
                    from: 'profiles.user_id',
                    to: 'users.id',
               },
          },
     };

     static async save(attr: TrackInterface) {
          try {
               const result = await Track.query().insert(attr);
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async getTracksById(medication_id: string) {
          try {
               const result = (await Track.query().select('*').where('medication_id', medication_id)) || null;
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

export default Track;
