import { BadRequestError, validateRequest } from '@oristic/common';
import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { body } from 'express-validator';
import Profile from '../modals/Profile';
import kafka from '../services/kafka';
const router = express.Router();
router.patch(
     '/profile',
     currentUser,
     [
          body('first_name')
               .optional()
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z]+$/)
               .withMessage('First Name must be valid or should not contain spaces'),
          body('last_name')
               .optional()
               .notEmpty()
               .isLength({ max: 64 })
               .matches(/^[A-Za-z]+$/)
               .withMessage('Last Name must be valid or should not contain spaces'),
          body('gender').optional().trim().notEmpty().isIn(['male', 'female']).withMessage('Gender must be male or female'),
          body('date_of_birth').optional().notEmpty().trim().withMessage('DOB must be valid'),
          body('avatar').optional().notEmpty().withMessage('Avatar URL must be valid'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { first_name, last_name, gender, date_of_birth, avatar } = req.body || null;
               const { id: user_id } = (req as any).currentUser;
               const data = await Profile.updateProfileRecord(user_id, first_name, last_name, gender, date_of_birth, avatar);
               await kafka.sendPayload(
                    {
                         event_type: process.env.UPDATE_PROFILE!,
                         content: { user_id, first_name, last_name },
                    },
                    process.env.TOPIC_EVENT!,
               );
               return res.status(200).json({ message: 'Updated Successfully', data });
          } catch (e) {
               throw new BadRequestError((e as Error).message);
          }
     },
);

export { router as patchProfileRouter };
