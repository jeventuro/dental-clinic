// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // ============================================================
  // REDIRECCIÓN POR DEFECTO
  // ============================================================
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ============================================================
  // AUTENTICACIÓN (público)
  // ============================================================
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

  // ============================================================
  // ROLES (protegidos) - Comentamos temporalmente para probar
  // ============================================================
  
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
  
  // src/app/app.routes.ts (añadir después de las rutas de roles)
  {
    path: 'admin-dashboard',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'client-dashboard',
    redirectTo: 'client/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'doctor-dashboard',
    redirectTo: 'doctor/dashboard',
    pathMatch: 'full',
  },

  // ============================================================
  // FALLBACK (comentado para depuración)
  // ============================================================
  // { path: '**', redirectTo: 'login' }, // <- lo comentamos para ver si hay errores
];

