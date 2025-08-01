import { ProfileInterface } from '../@types/interfaces';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import { SESClient } from '@aws-sdk/client-ses';
import { SNS } from '@aws-sdk/client-sns';
import { BadRequestError } from '@oristic/common';
import { getNotificationSettings } from '../controllers/notification';
import { MAP_NOTIFICATION_TYPE } from '../constants';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
class NotificationHandler {
     ses: SESClient;
     sns: SNS;
     nodemailer_transporter: Transporter<SentMessageInfo>;
     constructor() {
          this.ses = new SESClient({
               region: process.env.AWS_REGION!,
               credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
               },
          });
          this.sns = new SNS({
               region: process.env.AWS_REGION!,
               credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
               },
          });
          this.nodemailer_transporter = nodemailer.createTransport({
               host: 'smtpout.secureserver.net',
               port: 465,
               secure: true,
               auth: {
                    user: process.env.SENDER_EMAIL_ADDRESS!,
                    pass: process.env.HOST_EMAIL_PASSWORD!,
               },
          });
     }
     sendWelcomeEmailNotification = async ({ first_name, last_name, email }: ProfileInterface) => {
          const params = {
               from: process.env.SENDER_EMAIL_ADDRESS!,
               to: email,
               html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Poppins,sans-serif;background-color:#1b1a1a;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#1b1a1a;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1);padding:20px;text-align:center}h1{color:#fff}h4{line-height:25px;color:#fff}p{color:#fff;line-height:25px}.app-image{max-width:100%;height:auto;margin:20px 0}.btn{display:inline-block;padding:10px 20px;background-color:#3498db;color:#fff;text-decoration:none;border-radius:5px}.social-icons a{display:inline-block;margin:0 10px;text-decoration:none}</style></head><body><div class="container"><h1>Registration Completed 🎉</h1><h4>🚀 Welcome ${first_name} ${last_name} to the Most Beautiful & Interactive Mobile Application. Feel free to initiate its use for your convenience.</h4><p>Wellness Guard is cutting-edge and resilient solution that guarantees patients adhere to their prescribed medication schedule, fostering punctual and consistent intake.</p><img src="https://www.wellness-guard.com/_next/image?url=%2Fimages%2Fphone%2Fmain.png&w=1200&q=75" alt="Mobile App Screenshot" class="app-image"></a></div><p>Copyright © 2023, Wellness Guard . All Rights Reserved.</p></div></body></html>`,
               subject: 'Welcome To Wellness Guard Mobile Application',
          };
          try {
               const info = await this.nodemailer_transporter.sendMail(params);
               return info;
          } catch (error) {
               throw new Error((error as Error).message);
          }
     };

     sendResetPasswordEmail = async ({ email, token }: ProfileInterface) => {
          const reset_password_link = `${process.env.WEB_URL}/dev/app/reset_password/${token}`;
          const params = {
               from: process.env.SENDER_EMAIL_ADDRESS!,
               to: email,
               html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Password Reset</title><style>body{font-family:Poppins,sans-serif;background-color:#1b1a1a;margin:0;padding:0}.container{max-width:600px;margin:100px auto;background-color:#1b1a1a;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1);padding:20px}h4{color:#fff;text-align:left}h1{color:#fff;text-align:center}p{color:#fff;line-height:20px;text-align:left}</style></head><body><div class="container"><h1>Password Reset Request</h1><h4>Hello,</h4><p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p><p>To reset your password, please click the button below:</p><br><br><table cellspacing="0" cellpadding="0"><tr><td align="center" bgcolor="#3f51b5" style="border-radius:4px"><a href=${reset_password_link} target="_blank" style="font-size:16px;color:#fff;text-decoration:none;padding:12px 24px;border-radius:4px;background-color:#0d6efd">Reset Password</a></td></tr></table><br><br><p>If you're having trouble clicking the "Reset Password" button, you can copy and paste the following link into your browser:</p><a href=${reset_password_link} target="_blank">${reset_password_link}</a><p>This link will expire in two hours, so please reset your password as soon as possible.</p><h4>Thank you,<br>Wellness Guard Team</h4><p style="text-align:center;margin-top:10%">Copyright © 2023, Wellness Guard . All Rights Reserved.</p></div></body></html>`,
               subject: 'Wellness Guard Team',
          };

          try {
               const info = await this.nodemailer_transporter.sendMail(params);
               return info;
          } catch (error) {
               throw new Error((error as Error).message);
          }
     };
     sendVerificationEmail = async ({ email, code }: ProfileInterface) => {
          const params = {
               from: process.env.SENDER_EMAIL_ADDRESS!,
               to: email,
               html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email Verification</title><style>body{font-family:Poppins,sans-serif;background-color:#1b1a1a;margin:0;padding:0}.container{max-width:600px;margin:100px auto;background-color:#1b1a1a;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1);padding:20px}.code{background-color:#419ef3}a{color:#419ef3}h4{color:#fff;text-align:left}h1{color:#fff;text-align:center}p{color:#fff;line-height:20px;text-align:left}</style></head><body><div class="container"><h1>Email Confirmation Request</h1><h4>Hello,</h4><p>Thanks for registering up to Wellness Guard App, please type in the confirmation code shared below in the Wellness Guard App's screen to confirm your email address:</p><br><h1 class="code">${code}</h1><br><p>If you're having any trouble, you can contact us @</p><a>contact@wellness-guard.com</a><h4>Thank you,<br>Wellness Guard Team</h4><p style="text-align:center;margin-top:10%">Copyright © 2023, Wellness Guard . All Rights Reserved.</p></div></body></html>`,
               subject: 'Wellness Guard Email Confirmation',
          };

          try {
               const info = await this.nodemailer_transporter.sendMail(params);
               return info;
          } catch (error) {
               throw new Error((error as Error).message);
          }
     };

     createApplicationEndpoint = async (device_token: string) => {
          const params = {
               Token: device_token,
               PlatformApplicationArn: process.env.PLATFORM_APPLICATION_ARN!,
          };
          return await this.sns.createPlatformEndpoint(params);
     };

     sendPushNotification = async (medication_name: string, user_id: number, routine: string, medication_id: string) => {
          try {
               const { device_token } = await getNotificationSettings(user_id);
               console.log('Device token', device_token);

               const { EndpointArn } = await this.createApplicationEndpoint(device_token);
               const payload = {
                    notification: {
                         title: `${routine} Dose Reminder`,
                         body: `Hey it's time for ${routine} Dose for the ${medication_name}`,
                         data: {
                              type: MAP_NOTIFICATION_TYPE(routine),
                              medication_id,
                              routine,
                         },
                    },
               };
               const result = await this.sns.publish({
                    TargetArn: EndpointArn,
                    Message: JSON.stringify(payload),
               });
               if (result) {
                    console.log('Notification sent', result);
               }
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     };
}

export default new NotificationHandler();
