import mongoose from 'mongoose';
import { MedicationType } from '../@types';
import { MedicationStatus } from '../@types';
const medicationSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     disease: {
          type: String,
          required: true,
     },
     days: {
          type: Number,
          required: true,
     },
     status: {
          type: String,
          required: false,
          default: MedicationStatus.Created,
     },
     start_date: {
          type: Date,
          required: true,
     },
     end_date: {
          type: Date,
          required: true,
     },
     user_id: {
          type: Number,
          required: true,
     },
     doses: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Dose',
               required: false,
          },
     ],
});

interface MedicationModel extends mongoose.Model<MedicationType> {
     build: (attr: MedicationType) => any;
     findAllByUserId: (user_id: number) => null | MedicationDoc[];
     findAndUpdateOne: (medication_id: string, dose_id: string) => void;
     updateMedicationStatus: (medication_id: string, status: string) => any;
     retrieveMedicationDose: (medication_id: string) => any;
}

medicationSchema.statics.build = (attr: MedicationType) => {
     return new Medication(attr).save();
};

medicationSchema.statics.findAllByUserId = (user_id: number) => {
     return (
          Medication.find({ user_id }).populate({
               path: 'doses',
               populate: {
                    path: 'plans',
                    model: 'Plan',
               },
          }) || null
     );
};

medicationSchema.statics.updateMedicationStatus = async (medication_id, status) => {
     return Medication.findOneAndUpdate({ _id: medication_id }, { status: status });
};

medicationSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
     },
});
medicationSchema.statics.retrieveMedicationDose = async (medication_id: string) => {
     const result = (await Medication.findById(medication_id)?.populate({
          path: 'doses',
          populate: {
               path: 'plans',
               model: 'Plan',
          },
     })) as MedicationDoc;
     if (result && result.doses) {
          return result.doses;
     }
     return null;
};

medicationSchema.statics.findAndUpdateOne = async (medication_id: string, dose_id: string) => {
     await Medication.findOneAndUpdate(
          { _id: medication_id },
          {
               $push: {
                    doses: dose_id,
               },
          },
     );
};

interface MedicationDoc extends mongoose.Document {
     name: string;
     disease: string;
     days: number;
     start_date: Date;
     end_date: Date;
     user_id: number;
     status: string;
     doses: [];
}
const Medication = mongoose.model<MedicationDoc, MedicationModel>('Medication', medicationSchema);
export { Medication };
