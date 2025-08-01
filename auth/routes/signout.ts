import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/sign-out', (req: Request, res: Response) => {
     req.session = null;
     (req as any).currentUser = null;
     return res.status(200).json({ message: 'User Signed Out Successfully' });
});

export { router as signOutRouter };
