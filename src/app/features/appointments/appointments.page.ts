// src/app/features/appointments/appointments.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { DataService, Cita } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';
import { 
  calendarOutline, 
  timeOutline, 
  personOutline, 
  businessOutline, 
  cashOutline, 
  checkmarkCircleOutline,
  alertCircleOutline,
  medicalOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AppointmentsPage implements OnInit {
  public segmentValue = 'create';
  public pacienteId: string = '';

  // Catálogo de Tratamientos
  public treatments = [
    { name: 'Consulta Médica de Diagnóstico', specialty: 'Odontología General', price: 50, duration: 15 },
    { name: 'Limpieza Dental Avanzada', specialty: 'Odontología General', price: 120, duration: 30 },
    { name: 'Curación con Resina 3M', specialty: 'Odontología General', price: 150, duration: 30 },
    { name: 'Tratamiento de Endodoncia', specialty: 'Endodoncia', price: 450, duration: 60 },
    { name: 'Instalación de Brackets', specialty: 'Ortodoncia', price: 1200, duration: 120 }
  ];

  public doctors: any[] = [];
  public activeBranches: any[] = [];
  public citas: Cita[] = [];

  public newAppointment = {
    treatmentIndex: null as number | null,
    doctor_id: '',
    sede_id: '',
    date: '',
    time: '',
  };

  public minDate: string = new Date().toISOString().split('T')[0];
  public morningSlots: any[] = [];
  public afternoonSlots: any[] = [];

  // Simulación de horas ocupadas (después se reemplazará con consulta a BD)
  private dbOccupiedTimes: string[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({
      calendarOutline, timeOutline, personOutline, businessOutline,
      cashOutline, checkmarkCircleOutline, alertCircleOutline, medicalOutline
    });
  }

  async ngOnInit() {
    await this.cargarDatosIniciales();
    await this.cargarCitasUsuario();
  }

  private async cargarDatosIniciales() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Obtener paciente_id
    const { data: paciente } = await this.dataService.getPacienteByUsuarioId(user.id);
    if (paciente) {
      this.pacienteId = paciente.id;
    }

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
      this.activeBranches = sedes;
    }
  }

  private async cargarCitasUsuario() {
    if (!this.pacienteId) return;
    const { data } = await this.dataService.getCitasByPaciente(this.pacienteId);
    if (data) {
      this.citas = data;
    }
  }

  public onDateTimeCriteriaChange(): void {
    if (this.newAppointment.treatmentIndex === null || !this.newAppointment.date) {
      this.morningSlots = [];
      this.afternoonSlots = [];
      return;
    }

    const duration = this.treatments[this.newAppointment.treatmentIndex].duration;
    this.morningSlots = this.generateSlots(9, 0, 13, 0, duration);
    this.afternoonSlots = this.generateSlots(15, 0, 20, 30, duration);
  }

  private generateSlots(startHr: number, startMin: number, endHr: number, endMin: number, stepMinutes: number): any[] {
    const slots: any[] = [];
    let current = new Date();
    current.setHours(startHr, startMin, 0, 0);
    const end = new Date();
    end.setHours(endHr, endMin, 0, 0);

    while (current.getTime() + (stepMinutes * 60000) <= end.getTime()) {
      const formattedTime = this.formatTimeFromDate(current);
      slots.push({
        time: formattedTime,
        available: !this.dbOccupiedTimes.includes(formattedTime)
      });
      current.setTime(current.getTime() + stepMinutes * 60000);
    }
    return slots;
  }

  private formatTimeFromDate(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  public selectTime(slot: any): void {
    if (slot.available) {
      this.newAppointment.time = slot.time;
    }
  }

  public async onSubmitAppointment() {
    if (this.newAppointment.treatmentIndex === null || !this.newAppointment.doctor_id ||
        !this.newAppointment.sede_id || !this.newAppointment.date || !this.newAppointment.time) {
      await this.presentToast('Por favor, completa todos los campos.', 'warning');
      return;
    }

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
    if (error) {
      await this.presentToast('Error al agendar la cita: ' + error.message, 'danger');
      return;
    }

    await this.presentToast('¡Cita agendada con éxito!', 'success');
    this.resetForm();
    await this.cargarCitasUsuario();
    this.segmentValue = 'list';
  }

  private resetForm() {
    this.newAppointment = { treatmentIndex: null, doctor_id: '', sede_id: '', date: '', time: '' };
    this.morningSlots = [];
    this.afternoonSlots = [];
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}