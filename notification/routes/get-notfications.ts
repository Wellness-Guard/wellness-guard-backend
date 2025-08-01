import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { BadRequestError } from '@oristic/common';

import { fetchNotification } from '../controllers/notification';
const router = express.Router();

router.get('/notifications', currentUser, async (req: Request, res: Response) => {
     try {
          const { id } = (req as any).currentUser;
          console.log('id', id);
          const notification = await fetchNotification(id);
          if (notification) {
               return res.status(200).json({ data: notification, message: 'Notifications Found Successfully' });
          }
          return res.status(404).json({ errors: [{ message: 'Not Found' }] });
     } catch (e) {
          throw new BadRequestError((e as Error).message);
     }
});

export { router as getNotificationRouter };
