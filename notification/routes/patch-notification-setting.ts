import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { body } from 'express-validator';
import { BadRequestError } from '@oristic/common';
import { updateNotificationSetting } from '../controllers/notification';
import { NotificationType } from '../@types';
import notification from '../services/notification';

const router = express.Router();

router.patch(
     '/notification-setting',
     currentUser,
     [
          body('device_token').optional().notEmpty().isString().trim().withMessage('Provide valid device token'),
          body('push_notification').optional().isBoolean().withMessage('Provide valid boolean setting for push notification'),
     ],
     async (req: Request, res: Response) => {
          try {
               const { id: user_id } = (req as any).currentUser;
               const { device_token, push_notification } = (req.body as NotificationType) || null;
               const result = await updateNotificationSetting({ user_id, device_token, push_notification });
               if (device_token !== undefined) {
                    notification.createApplicationEndpoint(device_token);
               }
               if (result) {
                    return res.status(200).json({ message: 'Notfication Settings Updated Successfully', data: { device_token, push_notification } });
               }
               throw new Error('Something went wrong !!');
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as updateNotificationSettingRouter };
