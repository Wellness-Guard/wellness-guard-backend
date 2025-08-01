import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import env from 'dotenv';
import cookieSession from 'cookie-session';
import { errorHandler } from '@oristic/common';
import { connectionNoSQL } from './db';

import { postMedicationRouter } from './routes/post-medication';
import { getMedicationRouter } from './routes/get-medication';
import { getUserMedicationRouter } from './routes/get-user-medications';
import { getDiseasesRouter } from './routes/get-diseases';
import { getMedicineRouter } from './routes/get-medicines';
import { patchMedicationRouter } from './routes/patch-medication';
import { getMedicationDoseRouter } from './routes/get-medication-dose';
import { getDoseRouter } from './routes/get-dose';
import { DiseaseSeed, MedicineSeed } from './seeds';

// env.config({ path: '../.env' });
env.config();
const PORT = process.env.MEDICATION_PORT || 6000;
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

app.use('/api/v1/medic', postMedicationRouter);
app.use('/api/v1/medic', getMedicationRouter);
app.use('/api/v1/medic', getUserMedicationRouter);
app.use('/api/v1/medic', getDiseasesRouter);
app.use('/api/v1/medic', getMedicineRouter);
app.use('/api/v1/medic', patchMedicationRouter);
app.use('/api/v1/medic', getDoseRouter);
app.use('/api/v1/medic', getMedicationDoseRouter);
app.use(errorHandler);

app.all('*', async (req: Request, res: Response) => {
     return res.status(400).json({ errors: [{ message: 'Not Found' }] });
});
app.listen(PORT, async () => {
     const connection = await connectionNoSQL();
     if (connection) {
          console.log('Connected to Medication MongoDB Successfully!');
          if (await DiseaseSeed.shouldRun()) {
               console.log('Should Run');
               await DiseaseSeed.run();
          }
          if (await MedicineSeed.shouldRun()) {
               console.log('should run medicine script too');
               await MedicineSeed.run();
          }
     }
     console.log('App running on port 6000');
});
