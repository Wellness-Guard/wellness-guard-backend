export const NOTIFICATION_TYPE = {
     welcome_email_notification: 'welcome_email_notification',
     medication_started_notification: 'medication_started_notification',
     medication_completed_notification: 'medication_completed_notification',
     morning_dose_notification: 'morning_dose_notification',
     evening_dose_notification: 'evening_dose_notification',
     afternoon_dose_notification: 'afternoon_dose_notification',
};

export const MAP_NOTIFICATION_TYPE = (routine: string) => {
     switch (routine) {
          case 'Morning':
               return NOTIFICATION_TYPE.morning_dose_notification;
          case 'Afternoon':
               return NOTIFICATION_TYPE.afternoon_dose_notification;
          case 'Evening':
               return NOTIFICATION_TYPE.evening_dose_notification;
          default:
               return null;
     }
};
