import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Request } from 'express';
import User from '../modals/User';
import { JWT } from './jwt';
import { BadRequestError } from '@oristic/common';
import { Mode } from '../@types';
import kafka from './kafka';

console.log('CLIENT SECRET', process.env.GOOGLE_CLIENT_SECRET!);

const client_id = process.env.GOOGLE_CLIENT_ID!;
const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
const callback_url = process.env.GOOGLE_CALLBACK_URL!;

export class PassportService {
     static createGoogleStrategy() {
          passport.use(
               new GoogleStrategy(
                    {
                         clientID: client_id,
                         clientSecret: client_secret,
                         callbackURL: callback_url,
                         passReqToCallback: true,
                    },
                    async function (req: Request, refreshToken: string, accessToken: string, profile: any, done: any) {
                         try {
                              const { given_name: first_name, family_name: last_name, picture: avatar, email } = profile._json;
                              const result = await User.findOrCreate(first_name, last_name, email, avatar, Mode.Gmail);
                              const { id } = result;
                              const refresh_token = JWT.generateRefreshToken({ first_name, last_name, email, id });
                              const access_token = JWT.generateAccessToken({ first_name, last_name, email, id });
                              (req as any).session = {
                                   refresh_token,
                                   access_token,
                              };
                              await kafka.sendPayload(
                                   {
                                        event_type: process.env.OAUTH_USER!,
                                        content: { id, first_name, last_name, email },
                                   },
                                   process.env.TOPIC_EVENT!,
                              );
                              done(null, result);
                         } catch (error) {
                              throw new BadRequestError((error as Error).message);
                         }
                    },
               ),
          );
          passport.serializeUser(function (user, done) {
               done(null, user);
          });
     }

     static createFacebookStrategy() {
          passport.use(
               new FacebookStrategy(
                    {
                         clientID: process.env.FACEBOOK_APP_ID!,
                         clientSecret: process.env.FACEBOOK_APP_SECRET!,
                         callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
                         enableProof: true,
                         passReqToCallback: true,
                         profileFields: ['id', 'email', 'name', 'photos'],
                    },
                    async function (req: Request, refreshToken: string, accessToken: string, profile: any, done: any) {
                         const avatar = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                         const { email, first_name, last_name } = profile._json;
                         const result = await User.findOrCreate(first_name, last_name, email, avatar, Mode.Facebook);
                         const { id } = result;
                         const refresh_token = JWT.generateRefreshToken({ first_name, last_name, email, id });
                         const access_token = JWT.generateAccessToken({ first_name, last_name, email, id });
                         req.session = {
                              access_token,
                              refresh_token,
                         };
                         await kafka.sendPayload(
                              {
                                   event_type: process.env.OAUTH_USER!,
                                   content: { id, first_name, last_name, email },
                              },
                              process.env.TOPIC_EVENT!,
                         );
                         done(null, result);
                    },
               ),
          );
     }
}
