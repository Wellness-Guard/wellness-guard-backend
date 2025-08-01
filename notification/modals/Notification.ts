import mongoose from 'mongoose';
import { NotificationType } from '../@types';
const notificationSchema = new mongoose.Schema({
     user_id: {
          type: mongoose.Schema.Types.Number,
          rquired: true,
     },
     socket_id: {
          type: mongoose.Schema.Types.String,
          required: false,
          default: '',
     },
     device_token: {
          type: mongoose.Schema.Types.String,
          required: false,
          default: '',
     },
     push_notification: {
          type: mongoose.Schema.Types.Boolean,
          required: false,
          default: true,
     },
     notification_content: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Content',
          },
     ],
});

// tells mongodb to have build in model
interface NotificationModel extends mongoose.Model<NotificationDoc> {
     build(attrs: NotificationType): NotificationDoc;
     findOrCreate(attr: NotificationType): NotificationDoc;
     findAndPushOne(notification_id: string, content_id: string): NotificationType;
     findAndUpdate(attr: NotificationType): NotificationDoc;
     findOneHavingSocketID(user_id: number): string;
     findAndDeleteOne(user_id: number, notification_content_id: string): any;
     findAndUpdateSettings(settings: NotificationType): NotificationDoc;
     fetchSettings(user_id: number): NotificationDoc;
}

notificationSchema.statics.fetchSettings = async (user_id: number) => {
     const result = await Notification.findOne({ user_id: user_id });
     if (result) {
          const { socket_id, push_notification, device_token } = result;
          return {
               socket_id,
               push_notification,
               device_token,
          };
     }
     return null;
};

notificationSchema.statics.build = (attr: NotificationType) => {
     return new Notification(attr);
};

notificationSchema.statics.findOneHavingSocketID = async (user_id: number) => {
     const notification = (await Notification.findOne({ user_id: user_id, socket_id: { $ne: '' } })) || null;
     if (notification) {
          return notification.socket_id;
     }
     return '';
};
notificationSchema.statics.findOrCreate = async (attr: NotificationType) => {
     const notification = await Notification.findOne({ user_id: attr.user_id });
     return notification || (await new Notification({ user_id: attr.user_id, socket_id: attr.socket_id, notification_content: [] }).save());
};

notificationSchema.statics.findAndUpdate = async (attr: NotificationType) => {
     const notification = (await Notification.findOneAndUpdate({ user_id: attr.user_id }, { socket_id: attr.socket_id })) || null;
     return notification;
};

notificationSchema.statics.findAndUpdateSettings = async (settings: NotificationType) => {
     const notification =
          (await Notification.findOneAndUpdate(
               { user_id: settings.user_id },
               { device_token: settings.device_token, push_notification: settings.push_notification },
          )) || null;
     return notification;
};

notificationSchema.statics.findAndPushOne = async (notification_id: string, content_id: string) => {
     const result = await Notification.findOneAndUpdate(
          { _id: notification_id },
          {
               $push: {
                    notification_content: content_id,
               },
          },
     );
     return result;
};

notificationSchema.statics.findAndDeleteOne = async (user_id: number, notification_content_id: string) => {
     console.log('Notification Content Id', notification_content_id);
     const result = await Notification.findOneAndUpdate(
          { user_id: user_id },
          {
               $pull: {
                    notification_content: notification_content_id,
               },
          },
     );

     return result ? notification_content_id : null;
};

notificationSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret._id;
          delete ret.__v;
          return ret;
     },
});
// an interface which describes what properties Notification Document will have

interface NotificationDoc extends mongoose.Document {
     user_id: number;
     socket_id: string;
     notification_content: [];
     device_token: string;
     push_notification: boolean;
}

const Notification = mongoose.model<NotificationDoc, NotificationModel>('Notification', notificationSchema);

export { Notification };
