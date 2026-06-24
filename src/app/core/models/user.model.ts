// src/app/core/models/user.model.ts
export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  CLIENT = 'CLIENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  branch?: string;
  specialty?: string;
  phone?: string;
}