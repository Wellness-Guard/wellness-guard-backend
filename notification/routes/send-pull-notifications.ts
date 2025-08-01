import { BadRequestError } from '@oristic/common';
import express, { Request, Response } from 'express';
import SocketIO from '../services/socketio';
import NotificationHandler from '../services/notification';
const router = express.Router();

router.get('/send-pull-notification', async (req: Request, res: Response) => {
     try {
          const notification_content = {
               subject: 'Pull Notification',
               body: { message: 'This is to test pull notificaton' },
               type: 'morning_dose_notification',
               view: false,
               _id: '65ca71cd27ffdf8b3223a4b4',
          };

          // const socketIO = SocketIO.getInstance();
          // await socketIO?.send(notification_content, 153);
          await NotificationHandler.sendPushNotification('asdadadasd', 1, 'Morning', '65ca71cd27ffdf8b3223a4b4');
          res.status(200).json({ message: 'Pull Notification Sent' });
     } catch (e) {
          throw new BadRequestError((e as Error).message);
     }
});

export { router as sendPullNotification };
