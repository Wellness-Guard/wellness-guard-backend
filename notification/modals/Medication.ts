import { Model } from 'objection';
import { MedicationInterface } from '../@types/interfaces';
import { RelationMappings } from 'objection';
import { BadRequestError } from '@oristic/common';
import Track from './Track';
// mergin similar types
interface Medication extends MedicationInterface {}
class Medication extends Model {
     static get tableName() {
          return 'medications';
     }
     static get idColumn() {
          return 'medication_id';
     }
     static get jsonSchema() {
          return {
               type: 'object',
               required: ['user_id', 'status', 'start_date', 'end_date', 'disease', 'name'],
               properties: {
                    user_id: { type: 'integer' },
                    status: { type: 'string' },
                    name: { type: 'string' },
                    start_date: { type: 'string', format: 'date-time' },
                    end_date: { type: 'string', format: 'date-time' },
                    doses: { type: 'array' },
                    disease: { type: 'string' },
                    morning_dose_time: { type: 'string', format: 'date-time' },
                    afternoon_dose_time: { type: 'string', format: 'date-time' },
                    evening_dose_time: { type: 'string', format: 'date-time' },
               },
          };
     }
     static relationMappings: RelationMappings = {
          profile: {
               relation: Model.HasManyRelation,
               modelClass: Track, // to be made soon
               join: {
                    from: 'medications.medication_id',
                    to: 'tracks.medication_id',
               },
          },
     };
     static async saveMedication(attr: { [key: string]: any }) {
          try {
               const result = await Medication.query().insert(attr);
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }

     static async getMedication(medication_id: string) {
          try {
               const result = await Medication.query().findById(medication_id);
               return result;
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

export default Medication;
