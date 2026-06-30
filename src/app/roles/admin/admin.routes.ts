// src/app/roles/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { AppShellComponent } from '@shared/components/layout/app-shell.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
      },

      // Modulo de citas
      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/appointments/appointment-list/appointment-list.page').then(m => m.AppointmentListPage),
          },
          {
            path: 'new', 
            loadComponent: () => import('@features/appointments/appointment-form/appointment-form.page').then(m => m.AppointmentFormPage),
          },
          {
            path: ':id',
            loadComponent: () => import('@features/appointments/appointment-detail/appointment-detail.page').then(m => m.AppointmentDetailPage),
          }
        ]
      },
      {
        path: 'treatments',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/treatments/treatment-list/treatment-list.page').then(m => m.TreatmentListPage),
          },
          {
            path: 'new',
            loadComponent: () => import('@features/treatments/treatment-form/treatment-form.page').then(m => m.TreatmentFormPage),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('@features/treatments/treatment-form/treatment-form.page').then(m => m.TreatmentFormPage),
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
        children: [
          {
            path: '',
            loadComponent: () => import('@features/doctors/doctor-list/doctor-list.page').then(m => m.DoctorListPage),
          },
          {
            path: 'new',
            loadComponent: () => import('@features/doctors/doctor-form/doctor-form.page').then(m => m.DoctorFormPage),
          },
          /*{   //para futuras integraciones
            path: ':id',
            loadComponent: () => import('@features/doctors/doctor-detail/doctor-detail.page').then(m => m.DoctorDetailPage),
          },*/
          {
            path: 'edit/:id',
            loadComponent: () => import('@features/doctors/doctor-form/doctor-form.page').then(m => m.DoctorFormPage),
          },
        ]
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