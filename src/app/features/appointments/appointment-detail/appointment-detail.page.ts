// src/app/features/appointments/appointment-detail/appointment-detail.page.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calendarOutline,
  timeOutline,
  personOutline,
  medicalOutline,
  businessOutline,
  callOutline,
  mailOutline,
  cardOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  trashOutline,
  refreshOutline,
  checkmarkDoneCircleOutline
} from 'ionicons/icons';
import { DataService, Cita } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.page.html',
  styleUrls: ['./appointment-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDetailPage implements OnInit {
  // Datos de la cita
  cita: Cita | null = null;
  isLoading = true;
  isSubmitting = false;
  citaId: string = '';

  // Datos del paciente (desnormalizados para la vista)
  pacienteNombre = '';
  pacienteEmail = '';
  pacienteTelefono = '';
  pacienteDni = '';
  pacienteFechaNacimiento = '';

  // Datos del doctor
  doctorNombre = '';
  doctorEspecialidad = '';

  // Datos de la sede
  sedeNombre = '';
  sedeDireccion = '';
  sedeTelefono = '';

  // Estado para controlar el timeline
  estados = [
    { value: 'pendiente', label: 'Pendiente', icon: 'alert-circle-outline', color: 'warning' },
    { value: 'confirmada', label: 'Confirmada', icon: 'checkmark-circle-outline', color: 'success' },
    { value: 'completada', label: 'Completada', icon: 'checkmark-done-circle-outline', color: 'primary' },
    { value: 'cancelada', label: 'Cancelada', icon: 'close-circle-outline', color: 'danger' },
  ];

  // Indice del estado actual para el timeline
  estadoActualIndex = 0;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef
  ) {
    addIcons({
      arrowBackOutline,
      calendarOutline,
      timeOutline,
      personOutline,
      medicalOutline,
      businessOutline,
      callOutline,
      mailOutline,
      cardOutline,
      documentTextOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      createOutline,
      trashOutline,
      refreshOutline,
      checkmarkDoneCircleOutline
    });
  }

  async ngOnInit() {
    this.citaId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.citaId) {
      this.mostrarToast('ID de cita no válido', 'danger');
      this.router.navigate(['/admin/appointments']);
      return;
    }
    await this.cargarCita();
  }

  /**
   * Carga los datos de la cita desde Supabase
   */
  async cargarCita() {
    this.isLoading = true;
    try {
      const { data, error } = await this.dataService.getCitaById(this.citaId);
      if (error || !data) {
        this.mostrarToast('Error al cargar la cita: ' + error?.message, 'danger');
        this.router.navigate(['/admin/appointments']);
        return;
      }
      this.cita = data;
      this.procesarDatosCita();
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error en cargarCita:', error);
      this.mostrarToast('Error inesperado al cargar la cita', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Procesa los datos de la cita para la vista
   */
  private procesarDatosCita() {
    if (!this.cita) return;

    // Datos del paciente
    const paciente = this.cita.pacientes;
    if (paciente) {
      this.pacienteNombre = paciente.usuarios?.nombre_completo || 'Paciente no especificado';
      this.pacienteEmail = paciente.usuarios?.email || '';
      this.pacienteTelefono = paciente.usuarios?.telefono || '';
      this.pacienteDni = paciente.dni || '';
      this.pacienteFechaNacimiento = paciente.fecha_nacimiento || '';
    }

    // Datos del doctor
    const doctor = this.cita.doctores;
    if (doctor) {
      this.doctorNombre = doctor.usuarios?.nombre_completo || 'Doctor no especificado';
      this.doctorEspecialidad = doctor.especialidad || 'Odontología General';
    }

    // Datos de la sede
    const sede = this.cita.sede;
    if (sede) {
      this.sedeNombre = sede.nombre || 'Sede no especificada';
      this.sedeDireccion = sede.direccion || '';
      this.sedeTelefono = sede.telefono || '';
    }

    // Índice del estado actual
    const estadoValues = this.estados.map(e => e.value);
    this.estadoActualIndex = estadoValues.indexOf(this.cita.estado);
    if (this.estadoActualIndex === -1) this.estadoActualIndex = 0;
  }

  /**
   * Obtiene el color para el estado
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
   * Obtiene el label para el estado
   */
  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  /**
   * Verifica si un estado está activo (para el timeline)
   */
  isEstadoActivo(index: number): boolean {
    return index <= this.estadoActualIndex;
  }

  /**
   * Actualiza el estado de la cita
   */
  async actualizarEstado(nuevoEstado: 'confirmada' | 'completada' | 'cancelada') {
    if (!this.cita) return;
    if (this.cita.estado === nuevoEstado) {
      this.mostrarToast(`La cita ya está ${this.getEstadoLabel(nuevoEstado)}`, 'warning');
      return;
    }

    const confirmacion = await this.alertCtrl.create({
      header: 'Confirmar acción',
      message: `¿Estás seguro de marcar esta cita como ${this.getEstadoLabel(nuevoEstado)}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.ejecutarActualizacionEstado(nuevoEstado);
          }
        }
      ]
    });
    await confirmacion.present();
  }

  private async ejecutarActualizacionEstado(nuevoEstado: 'confirmada' | 'completada' | 'cancelada') {
    if (!this.cita) return;

    this.isSubmitting = true;
    const { error } = await this.dataService.updateCita(this.cita.id, { estado: nuevoEstado });
    this.isSubmitting = false;

    if (error) {
      this.mostrarToast('Error al actualizar: ' + error.message, 'danger');
      return;
    }

    this.mostrarToast(`Cita ${this.getEstadoLabel(nuevoEstado)} exitosamente`, 'success');
    await this.cargarCita();
  }

  /**
   * Navega a la edición de la cita
   */
  editarCita() {
    if (this.cita) {
      this.router.navigate([`/admin/appointments/edit/${this.cita.id}`]);
    }
  }

  /**
   * Elimina la cita
   */
  async eliminarCita() {
    if (!this.cita) return;

    const confirmacion = await this.alertCtrl.create({
      header: 'Eliminar cita',
      message: '¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.isSubmitting = true;
            const { error } = await this.dataService.deleteCita(this.cita!.id);
            this.isSubmitting = false;
            if (error) {
              this.mostrarToast('Error al eliminar: ' + error.message, 'danger');
              return;
            }
            this.mostrarToast('Cita eliminada exitosamente', 'success');
            this.router.navigate(['/admin/appointments']);
          }
        }
      ]
    });
    await confirmacion.present();
  }

  /**
   * Volver a la lista
   */
  goBack() {
    this.router.navigate(['/admin/appointments']);
  }

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