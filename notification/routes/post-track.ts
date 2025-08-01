import { BadRequestError, validateRequest } from '@oristic/common';
import express, { Request, Response } from 'express';
import Track from '../modals/Track';
import { currentUser } from '../middleware/current-user';
import { body } from 'express-validator';

const router = express.Router();
router.post(
     '/track',
     currentUser,
     [
          body('date').notEmpty().isISO8601().toDate().withMessage('Date must be valid and Date object'),
          body('medication_id').notEmpty().isString().withMessage('Must Provide valid medication_id'),
          body('taken').notEmpty().isBoolean().withMessage('Must Provide Taken status for required Dose'),
          body('routine').isString().isIn(['Morning', 'Afternoon', 'Evening']).withMessage('Must Provide valid routine for dose'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { medication_id, date, taken, routine } = req.body;
               const result = await Track.save({ medication_id, date, taken, routine });
               if (result) {
                    return res.status(200).json({ message: 'Routine Created Successfully' });
               }
               throw new Error('Something went wrong !!');
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as postTrackRouter };
