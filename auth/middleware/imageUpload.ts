import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { BadRequestError } from '@oristic/common';

const s3 = new S3Client({
     credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
     },
     region: process.env.AWS_REGION!,
});

const s3Storage = multerS3({
     s3,
     bucket: 'wellness-guard',

     contentType: multerS3.AUTO_CONTENT_TYPE,
     metadata: (req, file, next) => {
          next(null, { fieldname: file.filename });
     },
     key: (req, file, next) => {
          const fileName = Date.now() + '_' + file.fieldname + '_' + file.originalname;

          next(null, fileName);
     },
});

const sanitizeFile = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
     const fileExts = ['.png', '.jpg', '.jpeg', '.gig'];
     const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));
     const isAllowedMimeType = file.mimetype.startsWith('image/');
     if (isAllowedExt && isAllowedMimeType) {
          return cb(null, true);
     }
     return cb(new BadRequestError('File type not allowed'));
};

export const uploadImage = multer({
     storage: s3Storage,
     limits: {
          fileSize: 1024 * 1024 * 10, // 10 mb limit
     },
     fileFilter: (req, file, callback) => {
          sanitizeFile(file, callback);
     },
});
