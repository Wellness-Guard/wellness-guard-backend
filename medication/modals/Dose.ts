import mongoose from 'mongoose';
import { DoseType } from '../@types';
const doseSchema = new mongoose.Schema({
     routine: {
          type: String,
          required: true,
     },
     time: {
          type: Date,
          default: null,
          required: false,
     },
     plans: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Plan',
          },
     ],
});

interface DoseModel extends mongoose.Model<DoseType> {
     build: (attr: DoseType) => DoseDoc;
}

doseSchema.statics.build = (attr: DoseType) => {
     return new Dose(attr).save();
};

interface DoseDoc extends mongoose.Document {
     routine: string;
     time: Date | null;
     plans: [];
}

doseSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
     },
});

const Dose = mongoose.model<DoseDoc, DoseModel>('Dose', doseSchema);
export { Dose };
