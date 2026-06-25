import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  gridOutline,
  calendarOutline,
  peopleOutline,
  medicalOutline,
  cashOutline,
  analyticsOutline,
  settingsOutline,
  businessOutline,
  megaphoneOutline,
  headsetOutline,
  logOutOutline,
  chevronDownOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import { AdminMenuItem } from './admin-sidebar.model';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, RouterLinkActive]
})

export class AdminSidebarComponent {

  @Input() currentRole = 'ADMIN';

  collapsed = false;

  openedMenus: string[] = [];

  menuItems: AdminMenuItem[] = [

    {
      title: 'Dashboard',
      icon: 'grid-outline',
      route: '/admin-dashboard'
    },

    {
      title: 'Citas',
      icon: 'calendar-outline',
      route: '/appointments',
      badge: 12
    },

    {
      title: 'Pacientes',
      icon: 'people-outline',
      route: '/admin-patients'
    },

    {
      title: 'Tratamientos',
      icon: 'treatments-outline',
      route: '/admin-treatments'
    },
    {
      title: 'Doctores',
      icon: 'medical-outline',
      route: '/admin-doctors'
    },

    {
      title: 'Finanzas',
      icon: 'cash-outline',
      route: '/admin-finances',
      children: [

        {
          title: 'Ingresos',
          icon: 'analytics-outline',
          route: '/admin-finances/income'
        },

        {
          title: 'Egresos',
          icon: 'analytics-outline',
          route: '/admin-finances/expenses'
        }

      ]
    },

    {
      title: 'Marketing',
      icon: 'megaphone-outline',
      route: '/admin-marketing',
      roles: ['SUPER_ADMIN', 'MARKETING']
    },

    {
      title: 'Call Center',
      icon: 'headset-outline',
      route: '/admin-callcenter'
    },

    {
      title: 'Sedes',
      icon: 'business-outline',
      route: '/admin-branches'
    },

    {
      title: 'Configuración',
      icon: 'settings-outline',
      route: '/admin-settings'
    }

  ];

  constructor() {

    addIcons({
      gridOutline,
      calendarOutline,
      peopleOutline,
      medicalOutline,
      cashOutline,
      analyticsOutline,
      settingsOutline,
      businessOutline,
      megaphoneOutline,
      headsetOutline,
      logOutOutline,
      chevronDownOutline,
      chevronForwardOutline
    });

  }

  toggleSidebar() {

    this.collapsed = !this.collapsed;

  }

  toggleMenu(title: string) {

    if (this.openedMenus.includes(title)) {

      this.openedMenus =
        this.openedMenus.filter(menu => menu !== title);

      return;
    }

    this.openedMenus.push(title);

  }

  isMenuOpen(title: string): boolean {

    return this.openedMenus.includes(title);

  }

  hasAccess(item: AdminMenuItem): boolean {

    if (!item.roles) return true;

    return item.roles.includes(this.currentRole);

  }

}