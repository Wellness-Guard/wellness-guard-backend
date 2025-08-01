import mongoose from 'mongoose';
import { PlanType } from '../@types';
const planSchema = new mongoose.Schema({
     medicine_name: {
          type: String,
          required: true,
     },
     quantity: {
          type: Number,
          required: true,
     },
     medicine_type: {
          type: String,
          required: false,
     },
});

interface PlanModel extends mongoose.Model<PlanType> {
     build: (attr: PlanType) => PlanDoc;
     findOrCreate: (attr: PlanType) => PlanDoc;
}

interface PlanDoc extends mongoose.Document {
     medicine_name: string;
     quantity: number;
     medicine_type: number;
}

planSchema.statics.build = (attr: PlanType) => {
     return new Plan(attr).save();
};

planSchema.statics.findOrCreate = async (attr: PlanType) => {
     const result = (await Plan.findOne({ medicine_name: attr.medicine_name, medicine_type: attr.medicine_type, quantity: attr.quantity })) || null;
     return result || (await Plan.build(attr));
};
planSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
     },
});

const Plan = mongoose.model<PlanDoc, PlanModel>('Plan', planSchema);
export { Plan };
