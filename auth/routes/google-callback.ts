import express, { Request, Response } from 'express';
import passport from 'passport';
const router = express.Router();

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req: Request, res: Response) => {
     const { first_name, last_name, email } = (req as any).session.passport.user;
     (req as any).session.passport = null;
     res.redirect(`wellness-guard://SignIn/?isLoggedIn=true/first_name=${first_name}/last_name=${last_name.split(' ')[0]}/email=${email}`);
});

export { router as googleCallbackRouter };
