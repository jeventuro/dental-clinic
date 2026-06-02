import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class NotificationsPage{

  segmentValue = 'all';

  notifications = [
    {
      id: 1,
      title: 'Cita confirmada',
      message: 'Tu cita con el Dr. Carlos Medina fue confirmada para el 25 de Mayo a las 10:00 AM.',
      time: 'Hace 5 min',
      type: 'appointment',
      read: false,
      saved: true,
      icon: 'calendar-outline',
    },
    {
      id: 2,
      title: 'Pago registrado',
      message: 'Se registró correctamente tu pago de S/ 250.',
      time: 'Hace 1 hora',
      type: 'payment',
      read: true,
      saved: false,
      icon: 'card-outline'
    },
    {
      id: 3,
      title: 'Nuevo tratamiento',
      message: 'Se agregó un nuevo tratamiento a tu historial clínico.',
      time: 'Hace 3 horas',
      type: 'medical',
      read: false,
      saved: false,
      icon: 'medkit-outline'
    },
    {
      id: 4,
      title: 'Recordatorio',
      message: 'Recuerda asistir mañana a tu limpieza dental.',
      time: 'Hace 1 día',
      type: 'reminder',
      read: true,
      saved: true,
      icon: 'notifications-outline'
    }
  ];

  constructor(
    private toastController: ToastController
  ) {}
  

  get filteredNotifications() {

    if (this.segmentValue === 'all') {
      return this.notifications;
    }

    if (this.segmentValue === 'saved') {
      return this.notifications.filter(n => n.saved);
    }

    if (this.segmentValue === 'unread') {
      return this.notifications.filter(n => !n.read);
    }

    return this.notifications;
  }

  async markAsRead(notification: any) {
    notification.read = true;
    const toast = await this.toastController.create({
      message: 'Notificación marcada como leída',
      duration: 1500,
      color: 'success'
    });

    await toast.present();
  }

  async toggleSave(notification: any) {
    notification.saved = !notification.saved;
    const toast = await this.toastController.create({
      message: notification.saved
        ? 'Notificación guardada'
        : 'Notificación eliminada de guardados',
      duration: 1500,
      color: 'primary'
    });

    await toast.present();
  }

  async deleteNotification(id: number) {
    this.notifications =
      this.notifications.filter(n => n.id !== id);
    const toast = await this.toastController.create({
      message: 'Notificación eliminada',
      duration: 1500,
      color: 'danger'
    });

    await toast.present();
  }

}
