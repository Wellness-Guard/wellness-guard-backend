import express from 'express';
import passport from 'passport';
const router = express.Router();
router.get('/google/sign-in', passport.authenticate('google', { scope: ['profile', 'email'] }));

export { router as googleSignInRouter };
