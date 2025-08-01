import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '@oristic/common';
import { currentUser } from '../middleware/current-user';
import { Disease } from '../modals/Disease';
const router = express.Router();

router.get('/diseases', currentUser, validateRequest, async (req: Request, res: Response) => {
     try {
          const result = (await Disease.find()) || null;
          if (result) {
               return res.status(200).json({ data: result, message: 'Diseases Found' });
          }
          return res.status(404).json({ errors: [{ message: 'Not Found' }] });
     } catch (err) {
          throw new BadRequestError((err as Error).message);
     }
});

export { router as getDiseasesRouter };
