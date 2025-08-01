import Medication from '../modals/Medication';
import { Cron } from '../services/cron';
export const saveMedication = async (attr: { [key: string]: any }) => {
     try {
          const { name, disease, days, status, start_date, end_date, user_id, _id, doses } = attr || null;
          const result = await Medication.saveMedication({ name, disease, days, status, start_date, end_date, user_id, medication_id: _id, doses });
          if (result) {
               // schedule cron jobs reminders
               const schedule = Cron.scheduleCron(name, start_date, end_date, doses, _id);
               console.log('Schedule Crons', schedule);
               return result;
          }
     } catch (err) {
          throw new Error((err as Error).message);
     }
};
