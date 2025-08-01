import NotificationHandler from '../services/notification';
import { saveNotification } from './notification';
import { NOTIFICATION_TYPE } from '../constants';
import { NotificationContent } from '../@types';
import { saveMedication } from './medications';
import { KafkaEvent } from '../@types';
const events = async (kafkaEvent: KafkaEvent) => {
     const { event_type, content } = kafkaEvent!;
     if (event_type === process.env.REGISTER_USER || event_type === process.env.RESEND_CODE) {
          const { id, email, code } = content;
          try {
               await NotificationHandler.sendVerificationEmail({ id, email, code });
          } catch (err) {
               throw new Error((err as Error).message);
          }
     } else if (event_type === process.env.OAUTH_USER || event_type === process.env.REGISTERATION_COMPLETED) {
          const { id, first_name, last_name, email } = content;
          try {
               await NotificationHandler.sendWelcomeEmailNotification({ first_name, last_name, email });
               const notificationContent: NotificationContent = {
                    type: NOTIFICATION_TYPE.welcome_email_notification,
                    view: false,
                    subject: 'Welcome To Wellness Guard',
                    body: {
                         message: 'Wellness Guard is cutting-edge and resilient solution that guarantees patients adhere to their prescribed medication schedule, fostering punctual and consistent intake.',
                    },
                    user_id: id,
               };
               await saveNotification(notificationContent);
          } catch (err) {
               throw new Error((err as Error).message);
          }
     } else if (event_type === process.env.MEDICATION_STARTED) {
          console.log('Medicines Event received');
          const { id, medication } = content;
          const { days, disease } = medication;
          try {
               const notificationContent: NotificationContent = {
                    type: NOTIFICATION_TYPE.medication_started_notification,
                    view: false,
                    subject: 'Medication Reminder has been started',
                    body: {
                         message: `Medication Reminder has been started for ${disease} disease for ${days} days`,
                    },
                    user_id: id,
               };
               await saveMedication(medication);
               await saveNotification(notificationContent);
          } catch (err) {
               throw new Error((err as Error).message);
          }
     } else if (event_type === process.env.RESET_PASSWORD) {
          console.log('RESET_PASSWORD Event received');
          const { email, token } = content;
          try {
               await NotificationHandler.sendResetPasswordEmail({ email, token });
          } catch (err) {
               throw new Error((err as Error).message);
          }
     }
};

export { events as processEvent };
