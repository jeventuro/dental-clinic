// src/app/features/notifications/notification-list/notification-list.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataService, Notificacion } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class NotificationListPage implements OnInit {
  notificaciones: Notificacion[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const { data } = await this.dataService.getNotificaciones(user.id);
      this.notificaciones = data || [];
    }
  }

  async marcarLeida(id: string) {
    await this.dataService.marcarNotificacionLeida(id);
    this.notificaciones = this.notificaciones.map(n =>
      n.id === id ? { ...n, leido: true } : n
    );
  }
}