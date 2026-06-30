// src/app/features/payments/payment-list/payment-list.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  walletOutline,
  cashOutline,
  cardOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  alertCircleOutline,
  refreshOutline
} from 'ionicons/icons';
import { DataService, Pago } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.page.html',
  styleUrls: ['./payment-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PaymentListPage implements OnInit {  // ✅ Nombre corregido
  pagos: Pago[] = [];
  isLoading = true;
  totalPagado = 0;
  totalPendiente = 0;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      walletOutline,
      cashOutline,
      cardOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      alertCircleOutline,
      refreshOutline
    });
  }

  async ngOnInit() {
    await this.cargarPagos();
  }

  async cargarPagos() {
    this.isLoading = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      const { data: paciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (paciente) {
        const { data, error } = await this.dataService.getPagosByPaciente(paciente.id);
        if (error) throw error;
        this.pagos = data || [];
        this.calcularTotales();
      } else {
        this.pagos = [];
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      await this.mostrarToast('Error al cargar pagos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  calcularTotales() {
    this.totalPagado = this.pagos
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + p.monto, 0);
    this.totalPendiente = this.pagos
      .filter(p => p.estado === 'pendiente')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      'pagado': 'success',
      'pendiente': 'warning',
      'cancelado': 'danger'
    };
    return colores[estado] || 'medium';
  }

  getEstadoIcon(estado: string): string {
    const iconos: Record<string, string> = {
      'pagado': 'checkmark-circle-outline',
      'pendiente': 'alert-circle-outline',
      'cancelado': 'close-circle-outline'
    };
    return iconos[estado] || 'alert-circle-outline';
  }

  getMetodoLabel(metodo: string): string {
    const metodos: Record<string, string> = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia',
      'otro': 'Otro'
    };
    return metodos[metodo] || metodo;
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}