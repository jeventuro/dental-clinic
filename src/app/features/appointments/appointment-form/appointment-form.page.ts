// src/app/features/appointments/appointment-form/appointment-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  personOutline,
  businessOutline,
  medicalOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { DataService, Cita , TratamientoCatalogo} from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';


interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.page.html',
  styleUrls: ['./appointment-form.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class AppointmentFormPage implements OnInit {
  // Datos del paciente
  pacienteId: string = '';

  // Catálogos
  tratamientos: TratamientoCatalogo[] = [];

  doctors: any[] = [];
  branches: any[] = [];

  // Formulario
  newAppointment = {
    tratamiento_id:'',
    doctor_id: '',
    sede_id: '',
    date: '',
    time: ''
  };

  // Slots
  morningSlots: TimeSlot[] = [];
  afternoonSlots: TimeSlot[] = [];
  minDate: string = new Date().toISOString().split('T')[0];

  // Estado
  isLoading = false;
  isSubmitting = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      calendarOutline,
      timeOutline,
      personOutline,
      businessOutline,
      medicalOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      arrowBackOutline
    });
  }

  async ngOnInit() {
    await this.cargarDatosIniciales();
    await this.cargarTratamientos();
  }

  private async cargarTratamientos() {
    const data = await this.dataService.getTratamientos(true); // solo activos
    this.tratamientos = data;
  }
  /**
   * Carga doctores, sedes y paciente_id
   */
  private async cargarDatosIniciales() {
    this.isLoading = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        await this.mostrarToast('Usuario no autenticado', 'danger');
        return;
      }

      // 1. Obtener paciente asociado al usuario
      const { data: paciente, error: errorPaciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (errorPaciente || !paciente) {
        await this.mostrarToast('No se encontró información del paciente', 'warning');
        return;
      }
      this.pacienteId = paciente.id;

      // 2. Cargar doctores activos (solo los que tienen cuenta activa en usuarios)
      const doctores = await this.dataService.getDoctores();
      if (doctores && doctores.length > 0) {
        this.doctors = doctores.map((d: any) => ({
          id: d.id,
          name: d.usuarios?.nombre_completo || 'Doctor sin nombre',
          specialty: d.especialidad || 'Odontología General'
        }));
      }

      // 3. Cargar sedes
      const { data: sedes, error: errorSedes } = await this.dataService.getSedes();
      if (errorSedes) {
        console.error('Error al cargar sedes:', errorSedes);
        await this.mostrarToast('Error al cargar sedes', 'warning');
      } else {
        this.branches = sedes || [];
      }

      // Si no hay doctores, mostrar un mensaje informativo
      if (this.doctors.length === 0) {
        await this.mostrarToast('No hay doctores disponibles en este momento'); //quite aqui la 'info' 
      }

    } catch (error) {
      console.error('❌ Error en cargarDatosIniciales:', error);
      await this.mostrarToast('Error al cargar datos iniciales. Intenta de nuevo.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Cuando cambia la fecha o el tratamiento, recalcula los slots
   */
  async onDateTimeCriteriaChange() {
  // Validar que tengamos fecha y tratamiento seleccionado
  if (!this.newAppointment.date || !this.newAppointment.tratamiento_id) {
    this.morningSlots = [];
    this.afternoonSlots = [];
    return;
  }

  // Obtener duración del tratamiento seleccionado
  const tratamientoSeleccionado = this.tratamientos.find(
    t => t.id === this.newAppointment.tratamiento_id
  );
  if (!tratamientoSeleccionado) {
    this.morningSlots = [];
    this.afternoonSlots = [];
    return;
  }
  const duracion = tratamientoSeleccionado.duracion;

  // Obtener citas ocupadas para este doctor y fecha (excluyendo canceladas)
  let ocupados: string[] = [];
  if (this.newAppointment.doctor_id) {
    const { data: citas } = await this.dataService.getCitas({
      doctor_id: this.newAppointment.doctor_id,
      fecha: this.newAppointment.date
    });
    if (citas) {
      // Filtrar solo citas no canceladas (estado != 'cancelada')
      ocupados = citas
        .filter(c => c.estado !== 'cancelada')
        .map(c => c.hora);
    }
  }

  // Generar slots de mañana y tarde
  this.morningSlots = this.generarSlots(9, 0, 13, 0, duracion, ocupados);
  this.afternoonSlots = this.generarSlots(15, 0, 20, 30, duracion, ocupados);
  }
  /**
   * Genera slots de tiempo según parámetros
   */
  private generarSlots(
    startHr: number, 
    startMin: number, 
    endHr: number, 
    endMin: number, 
    stepMinutes: number, 
    ocupados: string[]
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let current = new Date();
    current.setHours(startHr, startMin, 0, 0);
    const end = new Date();
    end.setHours(endHr, endMin, 0, 0);

    while (current.getTime() + (stepMinutes * 60000) <= end.getTime()) {
      const formattedTime = this.formatTimeFromDate(current);
      slots.push({
        time: formattedTime,
        available: !ocupados.includes(formattedTime)
      });
      current.setTime(current.getTime() + stepMinutes * 60000);
    }
    return slots;
  }

  /**
   * Formatea la hora para mostrar
   */
  private formatTimeFromDate(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  /**
   * Selecciona una hora
   */
  selectTime(slot: TimeSlot) {
    if (slot.available) {
      this.newAppointment.time = slot.time;
    }
  }

  /**
   * Envía el formulario para guardar la cita
   */
  async onSubmit() {
  // 1. Validaciones básicas
  if (!this.newAppointment.tratamiento_id) {
    await this.mostrarToast('Selecciona un tratamiento', 'warning');
    return;
  }
  if (!this.newAppointment.doctor_id) {
    await this.mostrarToast('Selecciona un doctor', 'warning');
    return;
  }
  if (!this.newAppointment.sede_id) {
    await this.mostrarToast('Selecciona una sede', 'warning');
    return;
  }
  if (!this.newAppointment.date) {
    await this.mostrarToast('Selecciona una fecha', 'warning');
    return;
  }
  if (!this.newAppointment.time) {
    await this.mostrarToast('Selecciona una hora disponible', 'warning');
    return;
  }

  // 2. Obtener el tratamiento seleccionado
  const tratamientoSeleccionado = this.tratamientos.find(
    t => t.id === this.newAppointment.tratamiento_id
  );
  if (!tratamientoSeleccionado) {
    await this.mostrarToast('Tratamiento no válido', 'danger');
    return;
  }

  // 3. Preparar datos de la cita
  const citaData: Omit<Cita, 'id' | 'created_at' | 'updated_at'> = {
    paciente_id: this.pacienteId,
    doctor_id: this.newAppointment.doctor_id,
    sede_id: this.newAppointment.sede_id,
    fecha: this.newAppointment.date,
    hora: this.newAppointment.time,
    duracion: tratamientoSeleccionado.duracion,
    tratamiento: tratamientoSeleccionado.nombre,
    estado: 'pendiente' as const,
    notas: '',
  };

  // 4. Verificar que el horario no esté ocupado (doble chequeo)
  const { data: citasExistentes } = await this.dataService.getCitas({
    doctor_id: this.newAppointment.doctor_id,
    fecha: this.newAppointment.date
  });
  if (citasExistentes) {
    const ocupado = citasExistentes
      .filter(c => c.estado !== 'cancelada')
      .some(c => c.hora === this.newAppointment.time);
    if (ocupado) {
      await this.mostrarToast('El horario seleccionado ya está ocupado', 'warning');
      return;
    }
  }

  // 5. Crear la cita
  this.isSubmitting = true;
  try {
    const { error } = await this.dataService.createCita(citaData);
    if (error) {
      throw new Error(error.message);
    }
    await this.mostrarToast('¡Cita agendada con éxito!', 'success');
    this.router.navigate(['/client/appointments']);
  } catch (error: any) {
    await this.mostrarToast(error.message || 'Error al agendar la cita', 'danger');
  } finally {
    this.isSubmitting = false;
  }
}

  /**
   * Volver a la lista de citas
   */
  goBack() {
    this.router.navigate(['/client/appointments']);
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

  obtenerDuracionSeleccionada(): number {
    const tratamiento = this.tratamientos.find(
      t => t.id === this.newAppointment.tratamiento_id
    );
    return tratamiento?.duracion || 0;
  }

  obtenerNombreTratamiento(): string {
    const tratamiento = this.tratamientos.find(
      t => t.id === this.newAppointment.tratamiento_id
    );
    return tratamiento?.nombre || 'Selecciona un tratamiento';
  }

  obtenerPrecioTratamiento(): number {
    const tratamiento = this.tratamientos.find(
      t => t.id === this.newAppointment.tratamiento_id
    );
    return tratamiento?.precio || 0;
  }
}
