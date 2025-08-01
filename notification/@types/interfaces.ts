export interface ProfileInterface {
     first_name?: string;
     email: string;
     last_name?: string;
     id?: number;
     token?: string;
     code?: number;
}

export interface MedicationInterface {
     medication_id: string;
     status: string;
     user_id: number;
     start_date: Date;
     end_date: Date;
     Dose?: [];
     name: string;
     morning_dose_time?: Date;
     afternoon_dose_time?: Date;
     evening_dose_time?: Date;
}

export interface TrackInterface {
     id?: number;
     medication_id?: string;
     date: Date;
     routine: string;
     taken: boolean;
}

export interface DoseInterface {
     _id: string;
     routine: string;
     time: Date | null | string;
     plans: [];
}
