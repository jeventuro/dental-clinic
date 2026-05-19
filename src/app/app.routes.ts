import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'client-dashboard',
    loadComponent: () => import('./features/client/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
];
