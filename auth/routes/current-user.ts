import express, { Request, Response } from 'express';
import { JWT } from '../services/jwt';
import { BadRequestError } from '@oristic/common';
import { Payload } from '../@types';

const router = express.Router();

router.get('/current-user', (req: Request, res: Response) => {
     const { access_token } = req.session!;
     if (!req.session?.access_token) {
          return res.status(401).json({ Errors: [{ message: 'Not Authorized' }] });
     }

     if (access_token) {
          try {
               const payload = JWT.verifyAccessToken(access_token) as Payload;
               if (!payload) {
                    throw new BadRequestError('Not Authorized, token expired');
               }
               const { email, id, first_name, last_name } = payload;
               return res.status(200).json({ data: { id, email, first_name, last_name } });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }
});

export { router as currentUserRouter };
