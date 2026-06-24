// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';

import { SIDEBAR_CONFIG } from './sidebar.config';
import { SidebarItem } from './sidebar.model';
import { AuthService } from '@core/auth/auth.service';

import {
  homeOutline,
  calendarOutline,
  walletOutline,
  medicalOutline,
  settingsOutline,
  logOutOutline,
  personOutline,
  notificationsOutline,
  gridOutline,
  peopleOutline,
  cashOutline,
  analyticsOutline,
  searchOutline,
  addCircleOutline,
  chevronDownOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterLink, RouterLinkActive],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;

  menuItems: SidebarItem[] = [];
  filteredMenuItems: SidebarItem[] = [];
  searchTerm = '';

  userName = '';
  userAvatar = '';
  currentBranch = '';
  role = '';

  private openMenus: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      homeOutline,
      calendarOutline,
      walletOutline,
      medicalOutline,
      settingsOutline,
      logOutOutline,
      personOutline,
      notificationsOutline,
      gridOutline,
      peopleOutline,
      cashOutline,
      analyticsOutline,
      searchOutline,
      addCircleOutline,
      chevronDownOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Usar propiedades correctas del modelo
      this.userName = user.nombre_completo || 'Usuario';
      this.userAvatar = user.avatar_url || 'assets/images/default-avatar.png';
      // Mostrar nombre de la sede si está disponible (desde el perfil)
      this.currentBranch = (user as any).sede_nombre || user.sede_id || 'Sede Principal';
      this.role = user.rol || 'cliente';

      const roleKey = this.role.toUpperCase() as keyof typeof SIDEBAR_CONFIG;
      this.menuItems = SIDEBAR_CONFIG[roleKey] || [];
      this.filteredMenuItems = [...this.menuItems];
    } else {
      this.router.navigate(['/login']);
    }
  }

  filterMenu() {
    if (!this.searchTerm.trim()) {
      this.filteredMenuItems = [...this.menuItems];
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredMenuItems = this.menuItems.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(term);
      const matchChildren = item.children?.some(child =>
        child.title.toLowerCase().includes(term)
      );
      return matchTitle || matchChildren;
    });
  }

  toggleMenu(title: string) {
    if (this.openMenus.has(title)) {
      this.openMenus.delete(title);
    } else {
      this.openMenus.add(title);
    }
  }

  isMenuOpen(title: string): boolean {
    return this.openMenus.has(title);
  }

  goToNotifications() {
    const role = this.role?.toLowerCase();
    const base = role === 'admin' ? 'admin' : role === 'doctor' ? 'doctor' : 'client';
    this.router.navigate([`/${base}/notifications`]);
  }

  goToSettings() {
    const role = this.role?.toLowerCase();
    const base = role === 'admin' ? 'admin' : role === 'doctor' ? 'doctor' : 'client';
    this.router.navigate([`/${base}/settings`]);
  }

  logout() {
    this.authService.logout();
  }
}