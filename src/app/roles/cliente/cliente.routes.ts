// src/app/roles/cliente/cliente.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { AppShellComponent } from '@shared/components/layout/app-shell.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    data: { roles: ['cliente'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dash-view.page').then((m) => m.DashViewPage),
      },
      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/appointments/appointment-list/appointment-list.page').then((m) => m.AppointmentListPage),
          },
          {
            path: 'new',
            loadComponent: () => import('@features/appointments/appointment-form/appointment-form.page').then((m) => m.AppointmentFormPage),
          }
        ]
      },
      {
        path: 'treatments',
        loadComponent: () => import('@features/treatments/treatment-list/treatment-list.page').then((m) => m.TreatmentListPage),
      },
      {
        path: 'payments',
        loadComponent: () => import('@features/payments/payment-list/payment-list.page').then((m) => m.PaymentListPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'notifications',
        loadComponent: () => import('@features/notifications/notification-list/notification-list.page').then((m) => m.NotificationListPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('@features/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'locations',
        loadComponent: () => import('@features/locations/locations.page').then((m) => m.LocationsPage),
      },
    ],
  },
];