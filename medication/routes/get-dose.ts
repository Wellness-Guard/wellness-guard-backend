import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { param } from 'express-validator';
import { BadRequestError, validateRequest } from '@oristic/common';
import { getDose } from '../controllers/dose';

const router = express.Router();

router.get(
     '/dose/:_id',
     currentUser,
     [param('_id').exists().isString().withMessage('Must provide disease id')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { _id } = req.params;
               const result = await getDose(_id);
               if (result) {
                    return res.status(200).json({ data: result, message: 'Dose Found' });
               } else {
                    return res.status(404).json({ errors: [{ message: 'Not Found' }] });
               }
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as getDoseRouter };
