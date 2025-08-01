import { validateRequest, BadRequestError } from '@oristic/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Email } from '../services/email';
import User from '../modals/User';
import { Password } from '../services/password';
import { JWT } from '../services/jwt';
import Profile from '../modals/Profile';

const router = express.Router();

router.post(
     '/sign-in',
     [
          body('email').trim().isEmail().notEmpty().withMessage('Email must be valid'),
          body('password').trim().notEmpty().withMessage('Password must be provided'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          const { email, password } = req.body;
          if (!Email.checkProvider(email)) {
               throw new BadRequestError('Email provider must be valid');
          }
          try {
               const user = await User.query().findOne({ email });
               if (!user) {
                    throw new BadRequestError('Invalid Credentails Provided !!');
               }
               if (user.password === null) {
                    throw new Error('Invalid Credential Provided');
               }
               if (await Password.compare(user.password, password)) {
                    console.log(user);
                    const { id, verify } = user;
                    const profile = await User.relatedQuery<Profile>('profile').for(id);
                    const { first_name, last_name } = profile[0];
                    if (!verify) {
                         return res.status(200).json({ message: 'Please Verify Your Account', data: { id, email, first_name, last_name, verify } });
                    }
                    const refresh_token = JWT.generateRefreshToken({ email, id, first_name, last_name });
                    const access_token = JWT.generateAccessToken({ email, id, first_name, last_name });
                    req.session = {
                         refresh_token,
                         access_token,
                    };

                    return res.status(200).json({ message: 'User Logged In Successfully', data: { id, email, first_name, last_name, verify } });
               } else {
                    throw new BadRequestError('Invalid Credentails Provided');
               }
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as signInRouter };
