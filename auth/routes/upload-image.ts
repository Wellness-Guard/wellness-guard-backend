import { BadRequestError, validateRequest } from '@oristic/common';
import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/current-user';
import { uploadImage } from '../middleware/imageUpload';
import Profile from '../modals/Profile';
const router = express.Router();

router.put('/image-upload', currentUser, uploadImage.single('image'), validateRequest, async (req: Request, res: Response) => {
     try {
          if (!req.file) {
               throw new Error('Something went Wrong');
          }
          const { location } = (req as any).file;
          const { id: user_id } = (req as any).currentUser;
          const result = await Profile.updateAvatar(user_id, location);
          return res.status(200).json({ message: 'Updated Successfully', data: result });
     } catch (err) {
          throw new BadRequestError((err as Error).message);
     }
});

export { router as UploadImageRouter };
