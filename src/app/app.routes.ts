// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.page').then((m) => m.RegisterPage),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./roles/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./roles/cliente/cliente.routes').then((m) => m.CLIENT_ROUTES),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./roles/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES),
  },
  {
    path: 'patients-form',
    loadComponent: () => import('./features/patients/patients-form/patients-form.page').then( m => m.PatientsFormPage)
  },
  {
    path: 'doctor-form',
    loadComponent: () => import('./features/doctors/doctor-form/doctor-form.page').then( m => m.DoctorFormPage)
  },

];

