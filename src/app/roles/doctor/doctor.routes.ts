// src/app/roles/doctor/doctor.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { AppShellComponent } from '@shared/components/layout/app-shell.component';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    data: { roles: ['DOCTOR'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
      },

      // Módulos
      {
        path: 'appointments',
        loadComponent: () => import('@features/appointments/appointment-list/appointment-list.page').then((m) => m.AppointmentListPage),
      },
      {
        path: 'appointments/:id',
        loadComponent: () => import('@features/appointments/appointment-detail/appointment-detail.page').then((m) => m.AppointmentDetailPage),
      },
      {
        path: 'patients',
        loadComponent: () => import('@features/patients/patient-list/patient-list.page').then((m) => m.PatientListPage),
      },
      {
        path: 'patients/:id',
        loadComponent: () => import('@features/patients/patient-detail/patient-detail.page').then((m) => m.PatientDetailPage),
      },
      {
        path: 'treatments',
        loadComponent: () => import('@features/treatments/treatment-list/treatment-list.page').then((m) => m.TreatmentListPage),
      },
      {
        path: 'notifications',
        loadComponent: () => import('@features/notifications/notification-list/notification-list.page').then((m) => m.NotificationListPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('@features/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
];