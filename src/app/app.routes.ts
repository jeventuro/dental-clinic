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
    loadComponent: () => 
    import('./features/admin/dashboard/dashboard.page').then( m => m.DashboardPage),

      children: [

        {
          path: '',
          redirectTo: 'overview',
          pathMatch: 'full'
        },

        {
          path: 'overview',
          loadComponent: () =>
            import('./features/admin/overview/overview.page')
              .then(m => m.OverviewPage)
        },

        {
          path: 'appointments',
          loadComponent: () =>
            import('./features/admin/appointments/appointments.page')
              .then(m => m.AppointmentsPage)
        },

        {
          path: 'patients',
          loadComponent: () =>
            import('./features/admin/patients/patients.page')
              .then(m => m.PatientsPage)
        }

      ]

  },

  {
    path: 'client-dashboard',
    loadComponent: () =>
    import('./features/client/dashboard/dashboard.page').then(m => m.DashboardPage),

      children: [

        {
          path: '',
          redirectTo: 'dash-view',
          pathMatch: 'full'
        },

        {
          path: 'dash-view',
          loadComponent: () => 
            import('./features/client/dash-view/dash-view.page')
              .then( m => m.DashViewPage)
        },

        {
          path: 'appointments',
          loadComponent: () =>
            import('./features/client/appointments/appointments.page')
              .then(m => m.AppointmentsPage)
        },

        {
          path: 'treatments',
          loadComponent: () =>
            import('./features/client/treatments/treatments.page')
              .then(m => m.TreatmentsPage)
        },

        {
          path: 'payments',
          loadComponent: () =>
            import('./features/client/payments/payments.page')
              .then(m => m.PaymentsPage)
        },

        {
          path: 'profile',
          loadComponent: () =>
            import('./features/client/profile/profile.page')
              .then(m => m.ProfilePage)
        },

        {
          path: 'notifications',
          loadComponent: () =>
            import('./features/client/notifications/notifications.page')
              .then(m => m.NotificationsPage)
        },

        {
          path: 'settings',
          loadComponent: () => 
            import('./features/client/settings/settings.page')
              .then( m => m.SettingsPage)
        },

        {
          path: 'locations',
          loadComponent: () => import('./features/client/locations/locations.page').then( m => m.LocationsPage)
        },
      ]
  }, 
    
];
