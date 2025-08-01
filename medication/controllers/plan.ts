import { PlanType } from '../@types';
import { Plan } from '../modals/Plan';

export const savePlan = async (plan: PlanType) => {
     const result = await Plan.build(plan);
     return result;
};

export const getPlan = async (_id: string) => {
     const result = (await Plan.findById(_id)) || null;
     return result;
};

export const deletePlan = async (_id: string) => {
     const status = await Plan.deleteOne({ id: _id });
     return status;
};
