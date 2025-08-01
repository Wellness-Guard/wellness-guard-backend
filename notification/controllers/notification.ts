import { NotificationType } from '../@types';
import { NotificationContent } from '../@types';
import { Content } from '../modals/Content';
import { Notification } from '../modals/Notification';
import SocketIO from '../services/socketio';
const socketIO = SocketIO.getInstance();

export const saveNotification = async ({ type, user_id, view, subject, body }: NotificationContent) => {
     try {
          const notification = await Notification.findOrCreate({ user_id });
          const { _id: notification_id } = notification;
          const content = await Content.build({ type, subject, view, body });
          const { _id: content_id } = content;
          const result = await Notification.findAndPushOne(notification_id, content_id);
          await socketIO?.send(content, user_id);
          return result;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};

export const fetchNotification = async (user_id: number) => {
     try {
          const notification = (await Notification.findOne({ user_id }).populate('notification_content')) || null;
          return notification;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};

export const deleteNotification = async (user_id: number, notification_id: string) => {
     try {
          const result = await Notification.findAndDeleteOne(user_id, notification_id);
          return result;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};

export const updateNotificationSetting = async (settings: NotificationType) => {
     try {
          const result = await Notification.findAndUpdateSettings(settings);
          return result;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};

export const getNotificationSettings = async (user_id: number) => {
     try {
          const result = await Notification.fetchSettings(user_id);
          return result;
     } catch (err) {
          throw new Error((err as Error).message);
     }
};
