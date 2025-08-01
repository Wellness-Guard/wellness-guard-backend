import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '@oristic/common';
import { currentUser } from '../middleware/current-user';
import { param } from 'express-validator';
import { Medicine } from '../modals/Medicine';
const router = express.Router();

router.get(
     '/medicine/:disease',
     currentUser,
     [param('disease').exists().notEmpty().isString().withMessage('Please Provide valid Disease  ')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { disease } = req.params;
               const medicines = await Medicine.findOne({ disease });
               if (medicines) {
                    return res.status(200).json({ data: medicines, message: 'Medicines Found' });
               }
               return res.status(404).json({ errors: [{ message: 'Not Found' }] });
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as getMedicineRouter };
