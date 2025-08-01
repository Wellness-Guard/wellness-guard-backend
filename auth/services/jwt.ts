import { Payload } from '../@types';
import jwt from 'jsonwebtoken';

export class JWT {
     static generateRefreshToken(payload: Payload) {
          return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY!, { expiresIn: process.env.REFRESH_TOKEN_EXP_TIME });
     }
     static generateAccessToken(payload: Payload) {
          return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!, { expiresIn: process.env.ACCESS_TOKEN_EXP_TIME });
     }
     static verifyAccessToken(token: string) {
          try {
               return jwt.verify(token, process.env.ACCESS_TOKEN_KEY!);
          } catch (e) {
               return (e as Error).message;
          }
     }
     static verifyRefreshToken(token: string) {
          try {
               return jwt.verify(token, process.env.REFRESH_TOKEN_KEY!);
          } catch (e) {
               return (e as Error).message;
          }
     }
}
