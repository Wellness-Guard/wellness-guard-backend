import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import User from '../modals/User';
import { validateRequest, BadRequestError } from '@oristic/common';
import { Email } from '../services/email';
import Profile from '../modals/Profile';
import kafka from '../services/kafka';
const router = express.Router();

router.post(
     '/sign-up',
     [
          body('email').trim().isEmail().withMessage('Email must be valid'),
          body('password')
               .trim()
               .notEmpty()
               .isLength({ min: 8 })
               .withMessage(
                    'Password must be provided or should be 8 characters long, Valid 8-20 letters, must contain atleast alphabets, 1 special character [@_!]& 1 digit [0-9] and 0 spaces',
               ),
          body('first_name')
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z]+$/)
               .withMessage('first name must be provided or below 64 characters long or must not contain spaces'),
          body('last_name')
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z]+$/)
               .withMessage('last name must be provided or below 64 characters long or must not contain spaces'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          const { email, password, first_name, last_name } = req.body;
          if (!Email.checkProvider(email)) {
               throw new BadRequestError('Email provider must be valid');
          }
          const person = await User.query().findOne({ email });
          if (person) {
               throw new BadRequestError('Email already in use !!');
          }

          try {
               const result = await User.transaction(async (trx) => {
                    const user = await User.query(trx).insert({ email: email, password: password, verify: false });
                    console.log('USer', user);
                    const profile = await user.$relatedQuery<Profile>('profile', trx).insert({ first_name, last_name });
                    return { first_name: profile.first_name, last_name: profile.last_name, id: user.id, email: user.email, verify: user.verify };
               });

               const { id } = result;
               console.log('resul', result);
               const code = await User.createCode(id);
               await kafka.sendPayload(
                    { event_type: process.env.REGISTER_USER!, content: { id: result.id, first_name, last_name, email, code } },
                    process.env.TOPIC_EVENT!,
               );
               return res.status(200).json({
                    message: 'User Added Successfully, Kindly Verify the Code sent over the Email',
                    data: { id, email, first_name, last_name, verify: result.verify },
               });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as signUpRouter };
