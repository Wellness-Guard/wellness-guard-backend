import { Request, Response, NextFunction } from 'express';
import { JWT } from '../services/jwt';
import { BadRequestError } from '@oristic/common';
import { Payload } from '../@types';

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
     if (!req.session?.access_token) {
          return res.status(401).json({ Errors: [{ message: 'Unauthorized Access' }] });
     }

     try {
          const payload = JWT.verifyAccessToken(req.session.access_token) as Payload;

          if (!payload.id && !payload.email && !payload.first_name && !payload.last_name) {
               throw new BadRequestError('Unauthorized Token Expired');
          }
          (req as any).currentUser = payload;
          next();
     } catch (e) {
          throw new BadRequestError((e as Error).message);
     }
};
