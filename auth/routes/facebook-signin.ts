import express from 'express';
import passport from 'passport';
const router = express.Router();
router.get('/facebook/sign-in', passport.authenticate('facebook', { scope: ['email'] }));

export { router as facebookSignInRouter };
