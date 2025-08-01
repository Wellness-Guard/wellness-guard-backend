export type MedicationType = {
     name: string;
     status?: string;
     days: number;
     start_date: Date;
     end_date: Date;
     user_id: number;
     disease: string;
};

export type Payload = {
     id: number;
     first_name?: string;
     last_name?: string;
     email: string;
};

export type MedicineType = {
     disease: string;
     medicines?: string[];
};

export type PlanType = {
     medicine_name: string;
     quantity: number;
     medicine_type?: string;
};

export type DoseType = {
     routine: string; // Morning | Evening | Night
     time?: Date | null;
     plans?: [];
};

export enum Routine {
     Morning = 'Morning',
     Afternoon = 'Afternoon',
     Evening = 'Evening',
}

export enum MedicationStatus {
     Created = 'Created',
     Started = 'Started',
     Completed = 'Completed',
     Paused = 'Paused',
}

export enum Medicines {
     Capsule = 'Capsule',
     Tablet = 'Tablet',
     Liquid = 'Liquid',
}

export const RoutineArray = ['Morning', 'Afternoon', 'Evening'];
