import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// import cors from 'cors';
import env from 'dotenv';
import { setupDB } from './db/knex';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { PassportService } from './services/passport';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from '@oristic/common';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { refreshTokenRouter } from './routes/refresh-token';
import { googleSignInRouter } from './routes/google-signin';
import { googleCallbackRouter } from './routes/google-callback';
import { facebookSignInRouter } from './routes/facebook-signin';
import { facebookCallbackRouter } from './routes/facebook-callback';
import { getProfileRouter } from './routes/get-profile';
import { signOutRouter } from './routes/signout';
import { patchProfileRouter } from './routes/patch-profile';
import { UploadImageRouter } from './routes/upload-image';
import { resetPasswordRouter } from './routes/reset-password';
import { verifyResetTokenRoute } from './routes/verify-reset-token';
import { updatePasswordRoute } from './routes/update-password';
import { verifySignUpCode } from './routes/verify-signup-code';
import { resendCodeRouter } from './routes/resend-code';
const PORT = process.env.AUTH_PORT || 3001;
// env.config({ path: '../.env' });
env.config();
const app = express();
// const OPTIONS = {
//      origin: '*',
//      method: '*',
// }; chkawad
app.use(json());
app.use(
     cookieSession({
          signed: false,
          // secure: process.env.NODE_ENV === 'production',
          secure: false,
          httpOnly: true,
          name: 'authorization',
     }),
);
app.use(passport.initialize());
PassportService.createGoogleStrategy();
PassportService.createFacebookStrategy();
app.use('/api/v1/auth', currentUserRouter);
app.use('/api/v1/auth', signUpRouter);
app.use('/api/v1/auth', signInRouter);
app.use('/api/v1/auth', refreshTokenRouter);
app.use('/api/v1/auth', googleSignInRouter);
app.use('/api/v1/auth', googleCallbackRouter);
app.use('/api/v1/auth', facebookSignInRouter);
app.use('/api/v1/auth', facebookCallbackRouter);
app.use('/api/v1/auth', getProfileRouter);
app.use('/api/v1/auth', patchProfileRouter);
app.use('/api/v1/auth', UploadImageRouter);
app.use('/api/v1/auth', signOutRouter);
app.use('/api/v1/auth', resetPasswordRouter);
app.use('/api/v1/auth', verifyResetTokenRoute);
app.use('/api/v1/auth', updatePasswordRoute);
app.use('/api/v1/auth', verifySignUpCode);
app.use('/api/v1/auth', resendCodeRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', async (req, res) => {
     return res.status(404).json({ errors: [{ message: 'Not Found' }] });
});

app.use(errorHandler);
app.listen(PORT, async () => {
     if (await setupDB()) {
          console.log('Connected to PostgreSQL Successfully!');
     }
     console.log('App running on port 3001');
     console.log('ENVIRONMENT', process.env.NODE_ENV);
});
