export enum Mode {
     Email = 'email',
     Gmail = 'gmail',
     Facebook = 'facebook',
}

export interface Users {
     id: number;
     email: string;
     password: string;
     verify?: boolean;
     mode: Mode;
     //exceptional for transactional queries
     user_id?: number;
     code?: number;
     expire?: string;
}

export interface Profiles {
     id?: number;
     first_name?: string;
     last_name?: string;
     date_of_birth?: Date;
     age?: number;
     avatar?: string;
     user_id: number;
     gender?: string;
}

export interface ResetPasswords {
     id: number;
     token: string;
     user_id: number;
     created_at: Date;
     expire: Date | string;
}

export type Payload = {
     id: number;
     first_name?: string;
     last_name?: string;
     email: string;
};
