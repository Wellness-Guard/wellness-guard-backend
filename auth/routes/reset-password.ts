import { BadRequestError, validateRequest } from '@oristic/common';
import { body } from 'express-validator';
import { Email } from '../services/email';
import User from '../modals/User';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import ResetPassword from '../modals/ResetPassword';
import kafka from '../services/kafka';
const router = express.Router();

router.post(
     '/reset-password',
     [body('email').trim().isEmail().withMessage('Email must be valid')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { email } = req.body;
               if (!Email.checkProvider(email)) {
                    throw new BadRequestError('Email provider must be valid');
               }
               const record = await User.findEmail(email);
               if (!record) {
                    return res.status(404).json({ errors: [{ message: 'Relevant Email Not Found !!' }] });
               }
               const { id: user_id } = record;
               // delete previous entry from db
               await ResetPassword.deleteResetPassword(user_id);
               // create token
               const token = crypto.randomBytes(64).toString('hex');
               await ResetPassword.createResetPassword(user_id, token);

               console.log('token', token);

               await kafka.sendPayload({ event_type: process.env.RESET_PASSWORD!, content: { token, email } }, process.env.TOPIC_EVENT!);
               return res.status(200).json({ message: 'Reset Password link send over the Email' });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as resetPasswordRouter };
