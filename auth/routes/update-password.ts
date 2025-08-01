import { BadRequestError, validateRequest } from '@oristic/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import ResetPassword from '../modals/ResetPassword';
import User from '../modals/User';
const router = express.Router();
router.patch(
     '/update-password',

     [
          body('password')
               .trim()
               .notEmpty()
               .isLength({ min: 8 })
               .withMessage(
                    'Password must be provided or should be 8 characters long, Valid 8-20 letters, must contain atleast alphabets, 1 special character [@_!]& 1 digit [0-9] and 0 spaces',
               ),

          body('token').notEmpty().exists().isString().withMessage('must provide token to update password '),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { password, token } = req.body;
               // verify once again, incase user wait for more than 2 hours with opened webpage,
               const result = await ResetPassword.verifyResetToken(token);
               if (!result) {
                    return res.status(404).json({ message: 'Something went wrong, Link or Token Expired' });
               }
               const { user_id } = result[0];
               const updated_result = await User.updatePassword(user_id, password);
               if (updated_result) {
                    await ResetPassword.deleteResetPassword(user_id);
                    return res.status(200).json({ message: 'Password Updated Successfully', updated_result });
               }
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as updatePasswordRoute };
