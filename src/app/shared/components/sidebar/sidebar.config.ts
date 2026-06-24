import { SidebarItem } from './sidebar.model';

export const SIDEBAR_CONFIG: Record<string, SidebarItem[]> = {

  CLIENT: [

    {
      title: 'Inicio',
      icon: 'home-outline',
      route: '/client/dashboard/'
    },

    {
      title: 'Mis citas',
      icon: 'calendar-outline',
      route: '/client/appointments'
    },

    {
      title: 'Tratamientos',
      icon: 'medical-outline',
      route: '/client/treatments'
    },

    {
      title: 'Pagos',
      icon: 'wallet-outline',
      route: '/client/payments'
    },

    {
      title: 'Perfil',
      icon: 'person-outline',
      route: '/client/profile'
    },

    

  ],

  // src/app/shared/components/sidebar/sidebar.config.ts
  ADMIN: [
    { title: 'Dashboard', icon: 'grid-outline', route: '/admin/dashboard' },
    { title: 'Agenda General', icon: 'calendar-outline', route: '/admin/appointments' },
    { title: 'Pacientes', icon: 'people-outline', route: '/admin/patients' },
    { title: 'Doctores', icon: 'medical-outline', route: '/admin/doctors' },
    { title: 'Finanzas', icon: 'cash-outline', route: '/admin/finances' },
    { title: 'Marketing', icon: 'megaphone-outline', route: '/admin/marketing' },
    { title: 'Call Center', icon: 'call-outline', route: '/admin/calls' },
    { title: 'Sedes', icon: 'business-outline', route: '/admin/branches' },
    { title: 'Administración', icon: 'shield-outline', route: '/admin/users' },
  ],

  DOCTOR: [
    { title: 'Dashboard', icon: 'grid-outline', route: '/doctor/dashboard' },
    { title: 'Mis citas', icon: 'calendar-outline', route: '/doctor/appointments', badge: 5 },
    { title: 'Pacientes', icon: 'people-outline', route: '/doctor/patients' },
    { title: 'Tratamientos', icon: 'medical-outline', route: '/doctor/treatments' },
    { title: 'Configuración', icon: 'settings-outline', route: '/doctor/settings' },
  ]
};