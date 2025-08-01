import { BadRequestError, validateRequest } from '@oristic/common';
import express, { Request, Response } from 'express';
import { Content } from '../modals/Content';
import { currentUser } from '../middleware/current-user';
import { body } from 'express-validator';

const router = express.Router();
router.patch(
     '/notification',
     currentUser,
     [
          body('view').notEmpty().isBoolean().withMessage('View property must be boolean'),
          body('notification_content_id').notEmpty().isString().withMessage('Must provide notification_content id'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { view, notification_content_id } = req.body;
               const result = await Content.findAndUpdateOne(view, notification_content_id);
               if (result) {
                    return res.status(200).json({ message: 'Updated Successfully' });
               }
               throw new Error('Something went wrong !!');
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as patchNotificationRouter };
