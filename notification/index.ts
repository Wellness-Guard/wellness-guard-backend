import express, { Request, Response } from 'express';
import http from 'http';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from '@oristic/common';
import env from 'dotenv';
import { connectionNoSQL, connectionSQL } from './db';
import kafka from './services/kafka';
import { processEvent } from './controllers/process-events';
import cookieSession from 'cookie-session';
import { getNotificationRouter } from './routes/get-notfications';
import { patchNotificationRouter } from './routes/patch-notification';
const PORT = process.env.NOTIFICATION_PORT || 5000;
import SocketIO from './services/socketio';
// import { sendPullNotification } from './routes/send-pull-notifications';
import { deleteNotificationRouter } from './routes/delete-notification';
import { getTrackRouter } from './routes/get-tracks';
import { postTrackRouter } from './routes/post-track';
import { updateNotificationSettingRouter } from './routes/patch-notification-setting';

// env.config({ path: '../.env' });
env.config();
const app = express();

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

app.get('/', (req, res) => {
     return res.status(200).send('hello World');
});
app.use('/api/v1/notification', getNotificationRouter);
app.use('/api/v1/notification', patchNotificationRouter);
// app.use(sendPullNotification); #this route was created for testing purpose only
app.use('/api/v1/notification', deleteNotificationRouter);
app.use('/api/v1/notification', postTrackRouter);
app.use('/api/v1/notification', getTrackRouter);
app.use('/api/v1/notification', updateNotificationSettingRouter);

app.all('*', async (req: Request, res: Response) => {
     return res.status(400).json({ errors: [{ message: 'Not Found' }] });
});

app.use(errorHandler);
const startServer = async () => {
     return new Promise((resolve, reject) => {
          const server = http.createServer(app);
          server.listen(PORT, async () => {
               console.log('Notification Service running on PORT 5000');

               const connection = await connectionNoSQL();
               const sql_connect = await connectionSQL();
               if (connection) {
                    console.log('Connected to mongoDB Successfully!');
               }
               if (sql_connect) {
                    console.log('Connected to PostgreSQL DB Successfully!');
               }
               await kafka
                    .receivePayload('event')
                    .then(async (result) => {
                         console.log('Result', result);
                    })
                    .catch((err) => {
                         reject(Error((err as Error).message));
                    });
               resolve(server);
          });
     });
};

startServer()
     .then((server) => new SocketIO(server))
     .catch((err) => {
          console.log(err);
     });
