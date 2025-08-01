import { BadRequestError, validateRequest } from '@oristic/common';
import { currentUser } from '../middleware/current-user';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { saveMedication } from '../controllers/medication';
import { MedicationType } from '../@types';
const router = express.Router();

router.post(
     '/medication',
     currentUser,
     [
          body('name')
               .trim()
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z ]+$/)
               .withMessage('Medication Name must be proided'),
          body('disease')
               .trim()
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z]+$/)
               .withMessage('Disease Name must be provided'),
          body('days').notEmpty().isInt({ min: 1 }).withMessage('Valid Days must be provided'),
          body('start_date').notEmpty().isISO8601().toDate().withMessage('Start Date must be valid and Date object'),
          body('end_date').notEmpty().isISO8601().toDate().withMessage('End Date must be valid and Date object'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { id: user_id } = (req as any).currentUser;
               const { name, disease, days, start_date, end_date } = req.body;
               const result = await saveMedication({ name, disease, days, start_date, end_date, user_id } as MedicationType);
               if (result) {
                    return res.status(200).json({ message: 'Medication Saved Successfully', data: result });
               }
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as postMedicationRouter };
