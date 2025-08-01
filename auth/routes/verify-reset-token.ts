import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { BadRequestError, validateRequest } from '@oristic/common';
import ResetPassword from '../modals/ResetPassword';

const router = express.Router();

router.get(
     '/verify-token/:token',
     [param('token').exists().isString().withMessage('must provide token to verify ')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { token } = req.params;
               const result = await ResetPassword.verifyResetToken(token);
               if (result) {
                    return res.status(200).json({ message: 'Token Verify Successfully' });
               }
               return res.status(404).json({ message: 'Token Not Verify' });
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as verifyResetTokenRoute };
