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
import { DataService, Cita } from '@core/data/data.service';
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
  treatments = [
    { name: 'Consulta Médica de Diagnóstico', specialty: 'Odontología General', price: 50, duration: 15 },
    { name: 'Limpieza Dental Avanzada', specialty: 'Odontología General', price: 120, duration: 30 },
    { name: 'Curación con Resina 3M', specialty: 'Odontología General', price: 150, duration: 30 },
    { name: 'Tratamiento de Endodoncia', specialty: 'Endodoncia', price: 450, duration: 60 },
    { name: 'Instalación de Brackets', specialty: 'Ortodoncia', price: 1200, duration: 120 }
  ];

  doctors: any[] = [];
  branches: any[] = [];

  // Formulario
  newAppointment = {
    treatmentIndex: null as number | null,
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
  }

  /**
   * Carga doctores, sedes y paciente_id
   */
  private async cargarDatosIniciales() {
    this.isLoading = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.mostrarToast('Usuario no autenticado', 'danger');
        return;
      }

      // Obtener paciente
      const { data: paciente, error: errorPaciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (errorPaciente || !paciente) {
        this.mostrarToast('No se encontró información del paciente', 'warning');
        return;
      }
      this.pacienteId = paciente.id;

      // Cargar doctores
      const { data: doctores } = await this.dataService.getDoctores();
      if (doctores) {
        this.doctors = doctores.map(d => ({
          id: d.id,
          name: d.usuarios?.nombre_completo || 'Doctor',
          specialty: d.especialidad || 'Odontología General'
        }));
      }

      // Cargar sedes
      const { data: sedes } = await this.dataService.getSedes();
      if (sedes) {
        this.branches = sedes;
      }
    } catch (error) {
      console.error('Error en cargarDatosIniciales:', error);
      this.mostrarToast('Error al cargar datos iniciales', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Cuando cambia la fecha o el tratamiento, recalcula los slots
   */
  async onDateTimeCriteriaChange() {
    if (!this.newAppointment.date || this.newAppointment.treatmentIndex === null) {
      this.morningSlots = [];
      this.afternoonSlots = [];
      return;
    }

    const duration = this.treatments[this.newAppointment.treatmentIndex].duration;

    // Obtener citas ocupadas para esta fecha y doctor (si se seleccionó)
    let ocupados: string[] = [];
    if (this.newAppointment.doctor_id) {
      const { data: citas } = await this.dataService.getCitas({
        doctor_id: this.newAppointment.doctor_id,
        fecha: this.newAppointment.date
      });
      if (citas) {
        ocupados = citas.map(c => c.hora);
      }
    }

    this.morningSlots = this.generarSlots(9, 0, 13, 0, duration, ocupados);
    this.afternoonSlots = this.generarSlots(15, 0, 20, 30, duration, ocupados);
  }

  /**
   * Genera slots de tiempo según parámetros
   */
  private generarSlots(startHr: number, startMin: number, endHr: number, endMin: number, stepMinutes: number, ocupados: string[]): TimeSlot[] {
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
    if (this.newAppointment.treatmentIndex === null) {
      this.mostrarToast('Selecciona un tratamiento', 'warning');
      return;
    }
    if (!this.newAppointment.doctor_id) {
      this.mostrarToast('Selecciona un doctor', 'warning');
      return;
    }
    if (!this.newAppointment.sede_id) {
      this.mostrarToast('Selecciona una sede', 'warning');
      return;
    }
    if (!this.newAppointment.date) {
      this.mostrarToast('Selecciona una fecha', 'warning');
      return;
    }
    if (!this.newAppointment.time) {
      this.mostrarToast('Selecciona una hora disponible', 'warning');
      return;
    }

    this.isSubmitting = true;
    const selectedTreatment = this.treatments[this.newAppointment.treatmentIndex];

    const citaData = {
      paciente_id: this.pacienteId,
      doctor_id: this.newAppointment.doctor_id,
      sede_id: this.newAppointment.sede_id,
      fecha: this.newAppointment.date,
      hora: this.newAppointment.time,
      duracion: selectedTreatment.duration,
      tratamiento: selectedTreatment.name,
      estado: 'pendiente' as const,
    };

    const { error } = await this.dataService.createCita(citaData);
    this.isSubmitting = false;

    if (error) {
      this.mostrarToast('Error al agendar la cita: ' + error.message, 'danger');
      return;
    }

    this.mostrarToast('¡Cita agendada con éxito!', 'success');
    this.router.navigate(['/client/appointments']);
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
}