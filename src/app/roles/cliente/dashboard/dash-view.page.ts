// src/app/roles/cliente/dashboard/dash-view.page.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { DataService, Cita, Tratamiento, Notificacion } from '@core/data/data.service';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  calendarOutline,
  timeOutline,
  medicalOutline,
  walletOutline,
  imagesOutline,
  downloadOutline,
  documentTextOutline,
  logoWhatsapp,
  cloudUploadOutline,
  checkmarkCircleOutline,
  receiptOutline,
  chevronForwardOutline,
  calendarClearOutline,
  informationCircleOutline,
  todayOutline,
  personOutline,
  settingsOutline,
  logOutOutline,
  homeOutline,
  gridOutline,
  peopleOutline,
  cashOutline,
  analyticsOutline,
  searchOutline,
  notificationsOutline,
  ellipsisHorizontalOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dash-view',
  templateUrl: './dash-view.page.html',
  styleUrls: ['./dash-view.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashViewPage implements OnInit {
  public Math = Math;
  // Datos del usuario
  pacienteId: string = '';

  userName = '';
  userRole = '';
  userAvatar = '';
  usuarioId: string = '';

  // Próxima cita (datos reales)
  nextAppointment: Cita | null = null;

  // Resumen de cuenta
  accountSummary = { balance: 0, totalPaid: 0 };

  // Tratamiento activo
  tratamientoActivo: Tratamiento | null = null;

  // Actividad reciente
  actividadReciente: Notificacion[] = [];

  // Acciones rápidas (fijas)
  quickActions = [
    { label: 'Ver Radiografías', icon: 'images-outline', route: '/client/medical-records', color: 'primary' },
    { label: 'Descargar Facturas', icon: 'download-outline', route: '/client/invoices', color: 'secondary' },
    { label: 'Recetas Médicas', icon: 'document-text-outline', route: '/client/prescriptions', color: 'tertiary' },
    { label: 'Contactar por WhatsApp', icon: 'logo-whatsapp', route: 'https://wa.me/51999999999', color: 'success', external: true },
  ];

  recentActivities: any[] = [];
  // Mapeo de colores para actividad
  colorMap: Record<string, string> = {
    info: 'primary',
    exito: 'success',
    advertencia: 'warning',
    error: 'danger',
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    addIcons({
      addCircleOutline,
      calendarOutline,
      timeOutline,
      medicalOutline,
      walletOutline,
      imagesOutline,
      downloadOutline,
      documentTextOutline,
      logoWhatsapp,
      cloudUploadOutline,
      checkmarkCircleOutline,
      receiptOutline,
      chevronForwardOutline,
      calendarClearOutline,
      informationCircleOutline,
      todayOutline,
      personOutline,
      settingsOutline,
      logOutOutline,
      homeOutline,
      gridOutline,
      peopleOutline,
      cashOutline,
      analyticsOutline,
      searchOutline,
      notificationsOutline,
      ellipsisHorizontalOutline,
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre_completo || 'Cliente';
      this.userRole = user.rol === 'cliente' ? 'Paciente Premium' : 'Usuario';
      this.userAvatar = user.avatar_url || 'assets/avatars/default.png';
      this.usuarioId = user.id;

      // Obtener el paciente asociado a este usuario
      const { data: paciente } = await this.dataService.getPacienteByUsuarioId(this.usuarioId);
      if (paciente) {
        this.pacienteId = paciente.id;
        await this.cargarDatosDashboard();
      } else {
        console.warn('No se encontró paciente para el usuario:', this.usuarioId);
      }
    }
  }

  private async cargarDatosDashboard() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      // 1. Obtener el paciente_id del usuario logueado
      const { data: paciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (!paciente) {
        console.warn('No se encontró paciente para el usuario:', user.id);
        return;
      }
      this.pacienteId = paciente.id;
      this.usuarioId = user.id;

      // 2. Próxima cita
      const cita = await this.dataService.getProximaCita(this.pacienteId);
      if (cita) {
        this.nextAppointment = {
          id: cita.id,
          title: cita.tratamiento || 'Consulta',
          date: new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
          time: cita.hora.slice(0, 5),
          specialist: cita.doctores?.usuarios?.nombre_completo || 'Doctor',
          status: cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente',
        };
      } else {
        this.nextAppointment = null;
      }

      // 3. Resumen de cuenta
      const resumen = await this.dataService.getResumenCuenta(this.pacienteId);
      this.accountSummary = {
        balance: resumen.balance,
        totalPaid: resumen.totalPaid,
      };

      // 4. Tratamiento activo
      const tratamiento = await this.dataService.getTratamientoActivo(this.pacienteId);
      if (tratamiento) {
        this.activeTreatment = {
          id: tratamiento.id,
          name: tratamiento.nombre,
          phase: `Fase ${tratamiento.progreso}%`,
          progress: tratamiento.progreso,
          startDate: new Date(tratamiento.fecha_inicio || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
          estimatedEnd: new Date(tratamiento.fecha_fin || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
          nextStep: tratamiento.descripcion || 'Sin pasos definidos',
          lastVisit: 'Próxima visita programada',
        };
      } else {
        this.activeTreatment = null;
      }

      // 5. Actividad reciente
      const actividad = await this.dataService.getActividadReciente(this.usuarioId, 5);
      this.recentActivities = actividad.map((a: any) => ({
        icon: a.tipo === 'cita' ? 'calendar-outline' : 'notifications-outline',
        title: a.titulo,
        description: a.descripcion,
        date: new Date(a.fecha).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        color: a.tipo === 'cita' ? 'success' : 'primary',
      }));
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  }


  // Navegación
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }

  viewAllActivity() {
    this.router.navigate(['/client/notifications']);
  }

  newAppointment() {
    this.router.navigate(['/client/appointments/new']);
  }

  reschedule() {
    if (this.nextAppointment?.id) {
      this.router.navigate([`/client/appointments/reschedule/${this.nextAppointment.id}`]);
    }
  }

  cancelAppointment() {
    // Lógica de cancelación
    console.log('Cancelar cita');
  }
}