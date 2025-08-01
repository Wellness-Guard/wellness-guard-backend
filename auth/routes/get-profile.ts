import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { BadRequestError, NotFoundError } from '@oristic/common';

import Profile from '../modals/Profile';
const router = express.Router();

router.get('/profile', currentUser, async (req: Request, res: Response) => {
     try {
          const { id } = (req as any).currentUser;
          const profile = await Profile.profileRecord(id);
          if (profile) {
               return res.status(200).json({ data: profile, message: 'Profile Found Successfully' });
          }
          throw new NotFoundError();
     } catch (e) {
          throw new BadRequestError((e as Error).message);
     }
});

export { router as getProfileRouter };
