import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '@oristic/common';
import { body } from 'express-validator';
import { currentUser } from '../middleware/current-user';
import { MedicationStatus, RoutineArray, Medicines } from '../@types';
import { Plan } from '../modals/Plan';
import { Dose } from '../modals/Dose';
import { getMedicationById, saveDoseInMedication, updateStatus } from '../controllers/medication';
import kafka from '../services/kafka';
const router = express.Router();

router.patch(
     '/medication/:_id',
     currentUser,
     [
          body('status')
               .optional()
               .isString()
               .notEmpty()
               .isIn([MedicationStatus.Created, MedicationStatus.Started, MedicationStatus.Completed, MedicationStatus.Paused])
               .withMessage('Status must be valid'),
          body('doses.*.medicine_name').optional().notEmpty().isString().withMessage('Please provide valid medicine name'),
          body('doses.*.quantity')
               .optional()
               .notEmpty()
               .isInt({ min: 1, max: 4 })
               .withMessage('Please provide valid medicine quantity between 0 - 4'),
          body('doses.*.routine')
               .optional()
               .isArray()
               //  .isIn([Routine.Morning, Routine.Evening, Routine.Evening])
               .withMessage('routine must be between Morning,Afternoon, Evening'),
          body('doses.*.medicine_type')
               .optional()
               .isString()
               .isIn([Medicines.Capsule, Medicines.Tablet, Medicines.Liquid])
               .withMessage('Please Provide Valid Medicine Type'),
     ],
     validateRequest,
     async (req: Request, res: Response) => {
          try {
               const { status, doses } = req.body || null;
               const { _id } = req.params;
               const { id } = (req as any).currentUser;

               doses &&
                    Promise.all(
                         RoutineArray.map(async (routine_instance) => {
                              const dose = await Dose.build({ routine: routine_instance });
                              Promise.all(
                                   doses.map(
                                        async ({
                                             medicine_type,
                                             medicine_name,
                                             quantity,
                                             routine,
                                        }: {
                                             medicine_type: string;
                                             medicine_name: string;
                                             quantity: number;
                                             routine: string[];
                                        }) => {
                                             if (routine.includes(routine_instance)) {
                                                  const result = await Plan.findOrCreate({
                                                       medicine_type,
                                                       medicine_name,
                                                       quantity,
                                                  });
                                                  await dose.updateOne({
                                                       $push: {
                                                            plans: result._id,
                                                       },
                                                  });
                                             }
                                        },
                                   ),
                              );

                              await saveDoseInMedication(_id, dose._id);
                         }),
                    );

               status & (await updateStatus(_id, status));

               const medication = await getMedicationById(_id);
               if (status && status === MedicationStatus.Started) {
                    await kafka.sendPayload({ event_type: process.env.MEDICATION_STARTED!, content: { id, medication } }, process.env.TOPIC_EVENT!);
               }
               return res.status(200).json({ data: { medication }, message: 'Medication Updated Successfully!' });
          } catch (err) {
               throw new BadRequestError((err as Error).message);
          }
     },
);

export { router as patchMedicationRouter };
