import * as schedule from 'node-schedule';
import { DoseInterface } from '../@types/interfaces';
import notification from './notification';
import Medication from '../modals/Medication';
export class Cron {
     static morning_time = '09:30AM';
     static afternoon_time = '01:00PM';
     static everning_time = '06:00PM';

     static scheduleCron(name: string, start: Date, end: Date, doses: DoseInterface[], medication_id: string) {
          const start_date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          const end_date = new Date(end.getFullYear(), end.getMonth(), end.getDate());
          return schedule.scheduleJob(name, { start: start_date, end: end_date, rule: '0 6 * * *' }, function () {
               if (doses.length > 0) {
                    doses.map(async ({ routine, plans }) => {
                         const { user_id, name: medication_name } = (await Medication.getMedication(medication_id)) as { [key: string]: any };
                         if (plans.length > 0) {
                              if (routine === 'Morning') {
                                   schedule.scheduleJob('Morning Dose Notification', '0 8 * * *', function () {
                                        notification.sendPushNotification(medication_name, user_id, 'Morning', medication_id);
                                   });
                              } else if (routine === 'Afternoon') {
                                   schedule.scheduleJob('Afternoon Dose Notification', '0 12 * * *', function () {
                                        notification.sendPushNotification(medication_name, user_id, 'Morning', medication_id);
                                   });
                              } else if (routine === 'Evening') {
                                   schedule.scheduleJob('Evening Dose Notification', '0 17 * * *', function () {
                                        notification.sendPushNotification(medication_name, user_id, 'Morning', medication_id);
                                   });
                              }
                         }
                    });
               }
          });
     }
}
