import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SettingsPage  {

  // =========================
  // ACCOUNT
  // =========================

  biometricAccess = true;

  rememberSession = true;

  notificationsEnabled = true;

  emailNotifications = true;

  appointmentNotifications = true;

  paymentNotifications = false;

  darkMode = false;

  language = 'es';

  fontSize = 'medium';

  autoLogout = '15';

  selectedTheme = 'default';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  // =========================
  // SAVE SETTINGS
  // =========================

  async saveSettings() {

    const toast =
      await this.toastController.create({

      message:
        'Configuración actualizada correctamente',

      duration: 2000,

      color: 'success',

      position: 'top'

    });

    await toast.present();

  }

  // =========================
  // CLEAR CACHE
  // =========================

  async clearCache() {

    const alert =
      await this.alertController.create({

      header: 'Limpiar caché',

      message:
        '¿Deseas eliminar archivos temporales de la aplicación?',

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {
          text: 'Limpiar',

          role: 'confirm',

          handler: async () => {

            const toast =
              await this.toastController.create({

              message:
                'Caché eliminada correctamente',

              duration: 2000,

              color: 'warning'

            });

            await toast.present();

          }
        }
      ]
    });

    await alert.present();

  }

  // =========================
  // CLOSE SESSION
  // =========================

  async logout() {

    const alert =
      await this.alertController.create({

      header: 'Cerrar sesión',

      message:
        '¿Seguro que deseas cerrar tu sesión?',

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {
          text: 'Cerrar sesión',

          role: 'confirm',

          handler: async () => {

            const toast =
              await this.toastController.create({

              message:
                'Sesión cerrada correctamente',

              duration: 2000,

              color: 'danger'

            });

            await toast.present();

          }
        }
      ]
    });

    await alert.present();

  }


}
