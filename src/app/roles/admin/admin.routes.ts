// src/app/roles/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { AppShellComponent } from '@shared/components/layout/app-shell.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
      },

      // Módulos (features compartidos)
      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/appointments/appointment-list/appointment-list.page').then(m => m.AppointmentListPage),
          },
          {
            path: ':id',
            loadComponent: () => import('@features/appointments/appointment-detail/appointment-detail.page').then(m => m.AppointmentDetailPage),
          }
        ]
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
        path: 'doctors',
        loadComponent: () => import('@features/doctors/doctor-list/doctor-list.page').then((m) => m.DoctorListPage),
      },
      {
        path: 'finances',
        loadComponent: () => import('@features/finances/finances.page').then((m) => m.FinancesPage),
      },
      {
        path: 'branches',
        loadComponent: () => import('@features/branches/branches.page').then((m) => m.BranchesPage),
      },
      {
        path: 'users',
        loadComponent: () => import('@features/users/user-list/user-list.page').then((m) => m.UserListPage),
      },
      {
        path: 'reports',
        loadComponent: () => import('@features/reports/reports.page').then((m) => m.ReportsPage),
      },
      {
        path: 'inventory',
        loadComponent: () => import('@features/inventory/inventory.page').then((m) => m.InventoryPage),
      },

      // Configuración y notificaciones (globales)
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