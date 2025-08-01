import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '@oristic/common';
import { currentUser } from '../middleware/current-user';
import { getUserMedications } from '../controllers/medication';
const router = express.Router();

router.get('/medications', currentUser, validateRequest, async (req: Request, res: Response) => {
     try {
          const { id: user_id } = (req as any).currentUser;
          const result = await getUserMedications(user_id);
          if (result) {
               return res.status(200).json({ data: result, message: 'Medication Found' });
          }
          return res.status(404).json({ errors: [{ message: 'Not Found' }] });
     } catch (err) {
          throw new BadRequestError((err as Error).message);
     }
});

export { router as getUserMedicationRouter };
