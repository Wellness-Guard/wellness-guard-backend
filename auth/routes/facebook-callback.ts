import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req: Request, res: Response) => {
     (req as any).session.passport = null;
     // res.redirect(
     //      `wellness://app/login?firstName=${req.user.firstName}/lastName=${req.user.lastName}/email=${req.user.email}`
     //    );
     res.status(200).json({ message: 'success' });
});

export { router as facebookCallbackRouter };
