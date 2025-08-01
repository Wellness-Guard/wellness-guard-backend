import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { BadRequestError, validateRequest } from '@oristic/common';

import { deleteNotification } from '../controllers/notification';
import { param } from 'express-validator';
const router = express.Router();

router.delete(
     '/notification/:_id',
     currentUser,
     [param('_id').notEmpty().exists().withMessage('Must provide notification id in query params')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { id: user_id } = (req as any).currentUser;
               const { _id } = req.params;
               const result = await deleteNotification(user_id, _id);
               if (result) {
                    return res.status(200).json({ data: result, message: 'Notifications Deleted Successfully' });
               }
               return res.status(404).json({ errors: [{ message: 'Not Found' }] });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as deleteNotificationRouter };
