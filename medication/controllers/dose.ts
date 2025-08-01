import { DoseType } from '../@types';
import { Dose } from '../modals/Dose';

export const saveDose = async (attr: DoseType) => {
     const result = await Dose.build(attr);
     return result;
};

export const getDose = async (_id: string) => {
     const result = (await Dose.findById(_id).populate('plans')) || null;
     return result;
};
