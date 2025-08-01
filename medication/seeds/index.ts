import { Disease } from '../modals/Disease';
import { diseases } from '../constants/disease';
import { BadRequestError } from '@oristic/common';
import { Medicine } from '../modals/Medicine';
import Fs from 'fs';
import CsvReadableStream from 'csv-reader';
const inputStream = Fs.createReadStream('./seeds/drug.csv', 'utf8');
// require('events').EventEmitter.defaultMaxListeners = 100000;
import events from 'events';
events.EventEmitter.defaultMaxListeners = Infinity;

class DiseaseSeed {
     static async shouldRun() {
          const diseaseCount = await Disease.countDocuments({});
          return diseaseCount === 0;
     }

     static async run() {
          try {
               await Disease.insertMany(diseases);
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     }
}

class MedicineSeed {
     static async shouldRun() {
          const medicineCount = await Medicine.countDocuments({});
          return medicineCount === 0;
     }
     static async run() {
          diseases.map(({ name }) => {
               inputStream
                    .pipe(
                         new CsvReadableStream({
                              parseNumbers: true,
                              parseBooleans: true,
                              trim: true,
                         }),
                    )
                    .on('data', async (row: any) => {
                         if (row[2] === name) {
                              const result = await Medicine.findOrCreate(name);
                              if (result) {
                                   await result.updateOne({
                                        $addToSet: {
                                             medicines: row[1],
                                        },
                                   });
                              }
                         }
                    })
                    .on('end', function () {});
          });
     }
}

export { DiseaseSeed, MedicineSeed };
