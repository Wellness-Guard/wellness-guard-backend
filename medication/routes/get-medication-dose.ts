import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { currentUser } from '../middleware/current-user';
import { getMedicationDose } from '../controllers/medication';
import { BadRequestError, validateRequest } from '@oristic/common';

const router = express.Router();

router.get(
     '/medication/:medication_id/dose',
     currentUser,
     [param('medication_id').exists().isString().withMessage('must provide medication id ')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { medication_id } = req.params;
               const result = await getMedicationDose(medication_id);
               if (result) {
                    return res.status(200).json({ data: result, message: 'Doses Found Successfully' });
               }
               return res.status(404).json({ errors: [{ message: 'Not Found' }] });
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as getMedicationDoseRouter };
