import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { PaymentsService } from 'src/core/services/payments.service';
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

interface Appointment {
  id: number;
  treatment: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  branch: string;
  paymentType: 'Adelantado' | 'En Consulta';
  status: 'Pendiente' | 'Completada' | 'Cancelada';
}

interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AppointmentsPage {
  
  public segmentValue = 'create'; // Cambiado a 'create' para desarrollo rápido

  // 1. Catálogo de Tratamientos con Duración Profesional (en minutos)
  public treatments = [
    { name: 'Consulta Médica de Diagnóstico', specialty: 'Odontología General', price: 50, duration: 15 },
    { name: 'Limpieza Dental Avanzada', specialty: 'Odontología General', price: 120, duration: 30 },
    { name: 'Curación con Resina 3M', specialty: 'Odontología General', price: 150, duration: 30 },
    { name: 'Tratamiento de Endodoncia', specialty: 'Endodoncia', price: 450, duration: 60 },
    { name: 'Instalación de Brackets', specialty: 'Ortodoncia', price: 1200, duration: 120 }
  ];

  public doctors = [
    { name: 'Dr. Carlos Mendoza', specialty: 'Especialista en Estética' },
    { name: 'Dra. Ana Marina Solís', specialty: 'Especialista en Ortodoncia' },
    { name: 'Dr. Jorge Luis Ramos', specialty: 'Especialista en Endodoncia' }
  ];

  public activeBranches = [
    { id: 1, name: 'Sede Huaral - Central' },
    { id: 2, name: 'Sede Huaral - CliniDent' },
    { id: 3, name: 'Sede Comas' }
  ];

  public appointmentsList: Appointment[] = [];

  // Formulario vinculado
  public newAppointment = {
    treatmentIndex: null as number | null,
    doctor: '',
    branch: '',
    date: '',
    time: '',
    paymentMethod: 'consulta'
  };

  public minDate: string = new Date().toISOString().split('T')[0];
  
  // Arreglos que contendrán las horas divididas para la tabla visual
  public morningSlots: TimeSlot[] = [];
  public afternoonSlots: TimeSlot[] = [];

  // Mocks de horas ya ocupadas en BD por fecha para pruebas de colisión
  private dbOccupiedTimes: string[] = ['09:30 AM', '10:00 AM', '04:00 PM', '05:30 PM'];

  constructor(
    private toastController: ToastController,
    private paymentsService: PaymentsService

  ) {
    addIcons({
      calendarOutline, timeOutline, personOutline, businessOutline,
      cashOutline, checkmarkCircleOutline, alertCircleOutline, medicalOutline
    });
  }

  /**
   * Se ejecuta cada vez que cambia el tratamiento o la fecha para recalcular la tabla de horas
   */
  public onDateTimeCriteriaChange(): void {
    if (this.newAppointment.treatmentIndex === null || !this.newAppointment.date) {
      this.morningSlots = [];
      this.afternoonSlots = [];
      return;
    }

    const duration = this.treatments[this.newAppointment.treatmentIndex].duration;
    
    // Generar los bloques dinámicamente según las reglas del negocio
    this.morningSlots = this.generateSlots(9, 0, 13, 0, duration);
    this.afternoonSlots = this.generateSlots(15, 0, 20, 30, duration);
  }

  /**
   * Algoritmo avanzado para segmentar las franjas horarias operativas de la clínica
   */
  private generateSlots(startHr: number, startMin: number, endHr: number, endMin: number, stepMinutes: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    let current = new Date();
    current.setHours(startHr, startMin, 0, 0);

    const end = new Date();
    end.setHours(endHr, endMin, 0, 0);

    while (current.getTime() + (stepMinutes * 60000) <= end.getTime()) {
      const formattedTime = this.formatTimeFromDate(current);
      
      // Simulación de validación contra base de datos: comprobar si la hora ya está en el registro
      const isOccupied = this.dbOccupiedTimes.includes(formattedTime);

      slots.push({
        time: formattedTime,
        available: !isOccupied
      });

      // Avanzar el puntero de tiempo según los minutos requeridos por el servicio
      current.setTime(current.getTime() + stepMinutes * 60000);
    }

    return slots;
  }

  public selectTime(slot: TimeSlot): void {
    if (slot.available) {
      this.newAppointment.time = slot.time;
    }
  }

  private formatTimeFromDate(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    const hrStr = hours < 10 ? '0' + hours : hours;
    return `${hrStr}:${minStr} ${ampm}`;
  }

  public async onSubmitAppointment() {
    if (this.newAppointment.treatmentIndex === null || !this.newAppointment.doctor || 
        !this.newAppointment.branch || !this.newAppointment.date || !this.newAppointment.time) {
      this.presentToast('Por favor, selecciona todos los campos incluyendo el horario disponible.', 'warning');
      return;
    }

    const selectedTreatment = this.treatments[this.newAppointment.treatmentIndex];
    // ==========================================
    // LÓGICA DE INTERCONEXIÓN DE PAGOS
    // ==========================================
    if (this.newAppointment.paymentMethod === 'consulta') {
      // Caso A: Va presencial -> Se genera deuda automática en el Módulo de Pagos
      this.paymentsService.addPendingPayment(
        `Consulta Presencial: ${selectedTreatment.name}`, 
        selectedTreatment.price
      );
    } else {
      // Caso B: Pagó por adelantado -> Pasa directo al historial liquidado
      this.paymentsService.addDirectToHistory(
        `Adelantado: ${selectedTreatment.name}`, 
        selectedTreatment.price,
        'Visa' // Simula cobro por su tarjeta Visa registrada por defecto
      );
    }
    // ==========================================

    // Generar la cita en la agenda visual del usuario
    const created = {
      id: Math.floor(100 + Math.random() * 900),
      treatment: selectedTreatment.name,
      doctor: this.newAppointment.doctor,
      specialty: selectedTreatment.specialty,
      date: this.newAppointment.date,
      time: this.newAppointment.time,
      branch: this.newAppointment.branch,
      paymentType: this.newAppointment.paymentMethod === 'adelantado' ? 'Adelantado' : 'En Consulta' as any,
      status: 'Pendiente' as any
    };

    this.appointmentsList.unshift(created);
    
    const msg = this.newAppointment.paymentMethod === 'consulta'
      ? '¡Cita registrada! Se ha generado una orden de cobro en tu pestaña de Pagos.'
      : '¡Pago por adelantado procesado con éxito y cita agendada!';

    await this.presentToast(msg, 'success');
    this.resetForm();
    this.segmentValue = 'list';
  }
/*========================*/

  private resetForm() {
    this.newAppointment = { treatmentIndex: null, doctor: '', branch: '', date: '', time: '', paymentMethod: 'consulta' };
    this.morningSlots = [];
    this.afternoonSlots = [];
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({ message, duration: 3000, color, position: 'bottom' });
    await toast.present();
  }
}