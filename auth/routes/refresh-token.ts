import { BadRequestError } from '@oristic/common';
import express, { Request, Response } from 'express';
import { JWT } from '../services/jwt';
import { Payload } from '../@types';
const router = express.Router();

router.post('/refresh-token', (req: Request, res: Response) => {
     const access_token = req.session?.access_token || null;
     const refresh_token = req.session?.refresh_token || null;
     if (access_token && refresh_token) {
          try {
               const payload = JWT.verifyRefreshToken(refresh_token) as Payload;
               const { id, email, first_name, last_name } = payload;
               const new_access_token = JWT.generateAccessToken({ id, email, first_name, last_name });
               const new_refresh_token = JWT.generateAccessToken({ id, email, first_name, last_name });
               req.session = null;
               req.session = {
                    access_token: new_access_token,
                    refresh_token: new_refresh_token,
               };
               return res.status(200).json({ message: 'Token refreshed successfully' });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     }

     throw new BadRequestError('Invalid Request');
});

export { router as refreshTokenRouter };
