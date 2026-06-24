// src/app/features/appointments/appointment-list/appointment-list.page.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  medicalOutline,
  personOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  alertCircleOutline,
  refreshOutline,
  trashOutline,
  createOutline
} from 'ionicons/icons';
import { DataService, Cita } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.page.html',
  styleUrls: ['./appointment-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentListPage implements OnInit {
  // Estado de carga
  isLoading = false;
  
  // Citas del paciente
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  
  // Filtros
  filtroEstado: 'todas' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada' = 'todas';
  
  // Paciente ID
  pacienteId: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef
  ) {
    addIcons({
      calendarOutline,
      timeOutline,
      medicalOutline,
      personOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      alertCircleOutline,
      refreshOutline,
      trashOutline,
      createOutline
    });
  }

  async ngOnInit() {
    await this.cargarCitas();
  }

  /**
   * Carga las citas del paciente desde Supabase
   */
  async cargarCitas() {
    this.isLoading = true;
    
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.mostrarToast('Usuario no autenticado', 'danger');
        return;
      }

      // Obtener el paciente asociado al usuario
      const { data: paciente, error: errorPaciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (errorPaciente || !paciente) {
        this.mostrarToast('No se encontró información del paciente', 'warning');
        this.isLoading = false;
        return;
      }
      this.pacienteId = paciente.id;

      // Obtener citas del paciente
      const { data: citas, error: errorCitas } = await this.dataService.getCitasByPaciente(this.pacienteId);
      if (errorCitas) {
        this.mostrarToast('Error al cargar citas: ' + errorCitas.message, 'danger');
        this.isLoading = false;
        return;
      }

      this.citas = citas || [];
      this.aplicarFiltro();
      this.cd.detectChanges();
      
    } catch (error) {
      console.error('Error en cargarCitas:', error);
      this.mostrarToast('Error inesperado al cargar citas', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Aplica el filtro por estado
   */
  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.citasFiltradas = [...this.citas];
    } else {
      this.citasFiltradas = this.citas.filter(c => c.estado === this.filtroEstado);
    }
    // Ordenar por fecha ascendente (más próximas primero)
    this.citasFiltradas.sort((a, b) => {
      if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
      return a.hora.localeCompare(b.hora);
    });
  }

  /**
   * Cambia el filtro de estado
   */
  cambiarFiltro(estado: 'todas' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada') {
    this.filtroEstado = estado;
    this.aplicarFiltro();
    this.cd.detectChanges();
  }

  /**
   * Obtiene el color de la badge según el estado
   */
  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      'pendiente': 'warning',
      'confirmada': 'success',
      'completada': 'primary',
      'cancelada': 'danger'
    };
    return colores[estado] || 'medium';
  }

  /**
   * Obtiene el icono según el estado
   */
  getEstadoIcon(estado: string): string {
    const iconos: Record<string, string> = {
      'pendiente': 'alert-circle-outline',
      'confirmada': 'checkmark-circle-outline',
      'completada': 'checkmark-circle-outline',
      'cancelada': 'close-circle-outline'
    };
    return iconos[estado] || 'alert-circle-outline';
  }

  /**
   * Navega al formulario de nueva cita
   */
  nuevaCita() {
    this.router.navigate(['/client/appointments/new']);
  }

  /**
   * Navega al detalle de la cita (edición)
   */
  verDetalle(citaId: string) {
    this.router.navigate([`/client/appointments/${citaId}`]);
  }

  /**
   * Cancela una cita (solo si está pendiente o confirmada)
   */
  async cancelarCita(cita: Cita) {
    if (cita.estado === 'cancelada') {
      this.mostrarToast('Esta cita ya está cancelada', 'warning');
      return;
    }
    if (cita.estado === 'completada') {
      this.mostrarToast('No se puede cancelar una cita completada', 'warning');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Cancelar cita',
      message: `¿Estás seguro de cancelar la cita del ${new Date(cita.fecha).toLocaleDateString('es-ES')} a las ${cita.hora}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, cancelar',
          handler: async () => {
            const { error } = await this.dataService.updateCita(cita.id, { estado: 'cancelada' });
            if (error) {
              this.mostrarToast('Error al cancelar la cita: ' + error.message, 'danger');
              return;
            }
            this.mostrarToast('Cita cancelada exitosamente', 'success');
            await this.cargarCitas();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Toast helper
   */
  private async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}