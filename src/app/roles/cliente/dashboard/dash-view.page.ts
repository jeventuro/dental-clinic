// src/app/roles/cliente/dashboard/dash-view.page.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { DataService, Cita, Tratamiento } from '@core/data/data.service';
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

/**
 * Interfaz extendida para la próxima cita con datos adicionales
 */
interface ProximaCita extends Cita {
  doctor_nombre: string;
  especialidad: string;
}

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
  userName = '';
  userRole = '';
  userAvatar = '';
  usuarioId = '';
  pacienteId = '';

  // Próxima cita (datos reales)
  proximaCita: ProximaCita | null = null;
  tieneCita = false;

  // Resumen de cuenta
  balance = 0;
  totalPaid = 0;

  // Tratamiento activo
  tratamientoActivo: Tratamiento | null = null;

  // Actividad reciente
  actividadReciente: any[] = [];

  // Acciones rápidas (fijas)
  quickActions = [
    { label: 'Ver Radiografías', icon: 'images-outline', route: '/client/medical-records', color: 'primary' },
    { label: 'Descargar Facturas', icon: 'download-outline', route: '/client/invoices', color: 'secondary' },
    { label: 'Recetas Médicas', icon: 'document-text-outline', route: '/client/prescriptions', color: 'tertiary' },
    { label: 'Contactar por WhatsApp', icon: 'logo-whatsapp', route: 'https://wa.me/51999999999', color: 'success', external: true },
  ];

  // Mapeo de colores para actividad
  colorMap: Record<string, string> = {
    info: 'primary',
    exito: 'success',
    advertencia: 'warning',
    error: 'danger',
    cita: 'success',
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.registerIcons();
  }

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarDatosDashboard();
  }

  // ============================================================
  // 👤 CARGA DE DATOS DEL USUARIO
  // ============================================================
  private async cargarDatosUsuario() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userName = user.nombre_completo || 'Cliente';
    this.userRole = user.rol === 'cliente' ? 'Paciente Premium' : 'Usuario';
    this.userAvatar = user.avatar_url || 'assets/avatars/default.png';
    this.usuarioId = user.id;

    // Obtener paciente_id
    const { data: paciente } = await this.dataService.getPacienteByUsuarioId(this.usuarioId);
    if (paciente) {
      this.pacienteId = paciente.id;
    } else {
      console.warn('⚠️ No se encontró paciente para el usuario:', this.usuarioId);
    }
  }

  // ============================================================
  // 📊 CARGA DE DATOS DEL DASHBOARD
  // ============================================================
  private async cargarDatosDashboard() {
    if (!this.pacienteId) return;

    console.log('⏳ Iniciando carga de datos...');
    try {
      console.time('⏱️ Próxima cita');
      await this.cargarProximaCita();
      console.timeEnd('⏱️ Próxima cita');

      console.time('⏱️ Resumen cuenta');
      await this.cargarResumenCuenta();
      console.timeEnd('⏱️ Resumen cuenta');

      console.time('⏱️ Tratamiento activo');
      await this.cargarTratamientoActivo();
      console.timeEnd('⏱️ Tratamiento activo');

      console.time('⏱️ Actividad reciente');
      await this.cargarActividadReciente();
      console.timeEnd('⏱️ Actividad reciente');

      console.log('✅ Todos los datos cargados correctamente.');
      
      // Forzar detección de cambios
      this.cd.detectChanges();
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
    }
  }

  // ============================================================
  // 📅 PRÓXIMA CITA
  // ============================================================
  private async cargarProximaCita() {
    const cita = await this.dataService.getProximaCita(this.pacienteId);
    if (cita) {
      this.proximaCita = {
        ...cita,
        doctor_nombre: cita.doctores?.usuarios?.nombre_completo || 'Doctor',
        especialidad: cita.doctores?.especialidad || 'Especialista',
      };
      this.tieneCita = true;
    } else {
      this.proximaCita = null;
      this.tieneCita = false;
    }
  }

  // ============================================================
  // 💰 RESUMEN DE CUENTA
  // ============================================================
  private async cargarResumenCuenta() {
    const resumen = await this.dataService.getResumenCuenta(this.pacienteId);
    this.balance = resumen.balance;
    this.totalPaid = resumen.totalPaid;
  }

  // ============================================================
  // 💊 TRATAMIENTO ACTIVO
  // ============================================================
  private async cargarTratamientoActivo() {
    const tratamiento = await this.dataService.getTratamientoActivo(this.pacienteId);
    if (tratamiento) {
      this.tratamientoActivo = {
        ...tratamiento,
        fecha_inicio: tratamiento.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_fin: tratamiento.fecha_fin || new Date().toISOString().split('T')[0],
        descripcion: tratamiento.descripcion || 'Seguir tratamiento',
      };
    } else {
      this.tratamientoActivo = null;
    }
  }

  // ============================================================
  // 🔔 ACTIVIDAD RECIENTE
  // ============================================================
  private async cargarActividadReciente() {
    const actividad = await this.dataService.getActividadReciente(this.usuarioId, 5);
    this.actividadReciente = actividad.map(item => ({
      ...item,
      mensaje: item.mensaje || item.descripcion || 'Sin detalles',
      created_at: item.created_at || item.fecha || new Date().toISOString(),
    }));
  }

  // ============================================================
  // 🧭 MÉTODOS DE NAVEGACIÓN
  // ============================================================
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }

  viewAllActivity() {
    this.router.navigate(['/client/notifications']);
  }

  /**
   * Redirige a la página de agendar cita (usando la ruta definida en cliente.routes.ts)
   */
  newAppointment() {
    this.router.navigate(['/client/appointments']);
  }

  reschedule() {
    if (this.proximaCita) {
      this.router.navigate([`/client/appointments/reschedule/${this.proximaCita.id}`]);
    }
  }

  cancelAppointment() {
    if (this.proximaCita) {
      console.log('🗑️ Cancelar cita:', this.proximaCita.id);
      // Aquí iría la lógica de cancelación (llamar a DataService)
    }
  }

  // ============================================================
  // 🎨 REGISTRO DE ICONOS
  // ============================================================
  private registerIcons() {
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
}