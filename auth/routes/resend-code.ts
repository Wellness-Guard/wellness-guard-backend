import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import User from '../modals/User';
import { validateRequest, BadRequestError } from '@oristic/common';

// import Profile from '../modals/Profile';
import kafka from '../services/kafka';
const router = express.Router();

router.post(
     '/resend-code',
     [body('email').trim().isEmail().withMessage('Email must be valid')],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { email } = req.body;
               const user = await User.query().findOne({ email });
               if (user) {
                    const { id } = user;
                    const code = await User.createCode(id);
                    await kafka.sendPayload({ event_type: process.env.RESEND_CODE!, content: { id, email, code } }, process.env.TOPIC_EVENT!);
                    return res.status(200).json({
                         message: 'Code Resend Successfully, Kindly check your Email',
                    });
               }
               throw new BadRequestError('User Not Found');
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as resendCodeRouter };
