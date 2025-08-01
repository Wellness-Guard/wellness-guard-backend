import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { BadRequestError, validateRequest } from '@oristic/common';
import { currentUser } from '../middleware/current-user';
import { getMedicationById } from '../controllers/medication';
const router = express.Router();

router.get(
     '/medication/:_id',
     currentUser,
     [param('_id').exists().notEmpty().isString().withMessage('Please Provide valid string _id ')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { _id } = req.params;
               const result = await getMedicationById(_id);
               if (result) {
                    return res.status(200).json({ data: result, message: 'Medication Found' });
               }
               return res.status(404).json({ errors: [{ message: 'Not Found' }] });
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as getMedicationRouter };
