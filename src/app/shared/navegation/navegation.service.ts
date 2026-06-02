import { Injectable } from '@angular/core';
import { NavigationItem } from './navegation.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navigation: NavigationItem[] = [

    // CLIENTE

    {
      title: 'Inicio',
      icon: 'home-outline',
      route: '/client-dashboard',
      roles: ['client']
    },

    {
      title: 'Mis citas',
      icon: 'calendar-outline',
      route: '/appointments',
      roles: ['client']
    },

    {
      title: 'Tratamientos',
      icon: 'medical-outline',
      route: '/treatments',
      roles: ['client']
    },

    {
      title: 'Pagos',
      icon: 'wallet-outline',
      route: '/payments',
      roles: ['client']
    },

    {
      title: 'Perfil',
      icon: 'person-outline',
      route: '/profile',
      roles: ['client']
    },

    // ADMIN

    {
      title: 'Dashboard',
      icon: 'grid-outline',
      route: '/admin-dashboard',
      roles: ['admin']
    },

    {
      title: 'Citas',
      icon: 'calendar-outline',
      route: '/admin-appointments',
      roles: ['admin']
    },

    {
      title: 'Pacientes',
      icon: 'people-outline',
      route: '/admin-patients',
      roles: ['admin']
    },

    {
      title: 'Finanzas',
      icon: 'cash-outline',
      route: '/admin-finances',
      roles: ['admin']
    }

  ];

  getMenu(role: string) {

    return this.navigation.filter(
      item => item.roles.includes(role)
    );

  }

}