import mongoose from 'mongoose';
import { MedicineType } from '../@types';

const medicineSchema = new mongoose.Schema({
     disease: {
          type: String,
          unique: true,
          required: true,
     },
     medicines: {
          type: [],
          required: false,
     },
});

interface MedicineModel extends mongoose.Model<MedicineType> {
     findOrCreate: (disease: string) => MedicineDoc;
}

medicineSchema.statics.findOrCreate = async (disease: string) => {
     const medicine = (await Medicine.findOne({ disease: disease })) || null;
     return medicine || (await new Medicine({ disease: disease, medicines: [] }).save());
};

interface MedicineDoc extends mongoose.Document {
     disease: string;
     medicines: string[];
}
medicineSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
     },
});

medicineSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
     },
});

const Medicine = mongoose.model<MedicineDoc, MedicineModel>('Medicine', medicineSchema);
export { Medicine };
