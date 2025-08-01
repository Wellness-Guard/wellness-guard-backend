import { MedicationType } from '../@types';
import { Medication } from '../modals/Medication';

export const saveMedication = async (medication: MedicationType) => {
     const result = await Medication.build(medication);
     return result;
};

export const getMedicationById = async (_id: string) => {
     const result =
          (await Medication.findOne({ _id }).populate({
               path: 'doses',
               populate: {
                    path: 'plans',
                    model: 'Plan',
               },
          })) || null;
     return result;
};

export const getMedicationDose = async (_id: string) => {
     return await Medication.retrieveMedicationDose(_id);
};

export const getUserMedications = async (user_id: number) => {
     const result = await Medication.findAllByUserId(user_id);
     return result;
};

export const saveDoseInMedication = async (_id: string, dose_id: string) => {
     return await Medication.findAndUpdateOne(_id, dose_id);
};

export const updateStatus = async (_id: string, status: string) => {
     return await Medication.updateMedicationStatus(_id, status);
};
