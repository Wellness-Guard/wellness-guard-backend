import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@oristic/common';
import Profile from '../modals/Profile';
import User from '../modals/User';
import { JWT } from '../services/jwt';
import kafka from '../services/kafka';

const router = express.Router();

router.post(
     '/verify-signup-code',
     [body('id').isDecimal().withMessage('must provide Id to verify ')],
     [body('code').exists().isNumeric().withMessage('must provide code to verify')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { id, code } = req.body;
               console.log(code);
               const result = await User.verifyCode(id, code);
               if (result && result.length > 0) {
                    const { email } = result[0];
                    const profile = await Profile.profileRecord(id);
                    const { first_name, last_name } = profile!;

                    const refresh_token = JWT.generateRefreshToken({ first_name, last_name, email, id });
                    const access_token = JWT.generateAccessToken({ first_name, last_name, email, id });
                    req.session = {
                         refresh_token,
                         access_token,
                    };
                    await kafka.sendPayload(
                         { event_type: process.env.REGISTERATION_COMPLETED!, content: { id, first_name, last_name, email } },
                         process.env.TOPIC_EVENT!,
                    );

                    return res.status(200).json({ message: 'Code Verify Successfully, Proceed to Log In', data: { verify: true } });
               }
               throw new BadRequestError('Code did not verify, Either expired or wrong.');
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as verifySignUpCode };
