import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { BadRequestError } from '@oristic/common';
import { param } from 'express-validator';
import { fetchTracksByMedication } from '../controllers/tracks';
const router = express.Router();

router.get(
     '/tracks/:medication_id',
     [param('medication_id').notEmpty().exists().withMessage('Must provide medication_id in query params')],
     currentUser,
     async (req: Request, res: Response) => {
          try {
               const { medication_id } = req.params;
               const tracks = await fetchTracksByMedication(medication_id);
               if (tracks) {
                    return res.status(200).json({ data: tracks, message: 'Medication Track Found Successfully' });
               }
               return res.status(404).json({ errors: [{ message: 'Not Found' }] });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as getTrackRouter };
