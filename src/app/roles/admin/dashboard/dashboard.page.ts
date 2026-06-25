// src/app/roles/admin/dashboard/dashboard.page.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { AuthService } from '@core/auth/auth.service';
import { DataService } from '@core/data/data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('financialChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  userName = '';
  userRole = '';
  userBranch = '';
  todayDate = new Date();
  // KPIs (mock - se reemplazarán con datos reales más adelante)
  kpis = [
    { 
      label: 'Ingresos Totales', 
      value: '$124,590.00', 
      icon: 'cash-outline', 
      change: '+12.5% vs mes ant.',
      changeUp: true,
      color: 'primary'
    },
    { 
      label: 'Citas Hoy', 
      value: '28/35', 
      icon: 'calendar-outline', 
      subtext: 'Capacidad',
      change: '',
      color: 'warning'
    },
    { 
      label: 'Nuevos Pacientes', 
      value: '142', 
      icon: 'people-outline', 
      change: '+5% esta semana',
      changeUp: true,
      color: 'success'
    },
    { 
      label: 'Doctores Activos', 
      value: '18', 
      icon: 'medical-outline', 
      subtext: '3 Sedes conectadas',
      change: '',
      color: 'tertiary'
    },
  ];

  quickActions = [
    { label: 'Agenda General', icon: 'calendar-outline', route: '/admin/appointments' },
    { label: 'Pacientes', icon: 'people-outline', route: '/admin/patients' },
    { label: 'Doctores', icon: 'medical-outline', route: '/admin/doctors' },
    { label: 'Finanzas', icon: 'cash-outline', route: '/admin/finances' },
    { label: 'Marketing', icon: 'megaphone-outline', route: '/admin/marketing' },
    { label: 'Call Center', icon: 'call-outline', route: '/admin/calls' },
  ];

  todayAppointments = [
    { 
      time: '09:00', 
      patient: 'Ana Martínez', 
      initials: 'AM',
      doctor: 'Dr. Lozano', 
      specialty: 'Odontología Gral.',
      treatment: 'Limpieza Profunda', 
      status: 'En Curso', 
      statusColor: 'warning' 
    },
    { 
      time: '09:45', 
      patient: 'Javier Ruiz', 
      initials: 'JR',
      doctor: 'Dra. Valencia', 
      specialty: 'Ortodoncia',
      treatment: 'Ajuste Brackets', 
      status: 'Confirmada', 
      statusColor: 'success' 
    },
    { 
      time: '10:30', 
      patient: 'Laura Gómez', 
      initials: 'LG',
      doctor: 'Dr. Smith', 
      specialty: 'Cirugía',
      treatment: 'Implante Dental', 
      status: 'Pendiente', 
      statusColor: 'medium' 
    },
  ];

  chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    ingresos: [65, 59, 80, 81, 56],
    egresos: [28, 48, 40, 19, 86],
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.dataService.getCurrentUserProfile();
    if (user) {
      this.userName = user.nombre_completo || 'Administrador';
      this.userRole = user.rol || 'admin';
      this.userBranch = (user as any).sede_nombre || user.sede_id || 'Sede Principal';
    }
  }

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: 'Ingresos',
            data: this.chartData.ingresos,
            borderColor: '#0f766e',
            backgroundColor: 'rgba(15, 118, 110, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#0f766e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Egresos',
            data: this.chartData.egresos,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: { family: 'Poppins', size: 12 },
            },
          },
          tooltip: {
            backgroundColor: '#1A535C',
            titleFont: { family: 'Poppins', size: 12 },
            bodyFont: { family: 'Roboto', size: 12 },
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Poppins', size: 11 }, color: '#6b7280' },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
            ticks: { font: { family: 'Poppins', size: 11 }, color: '#6b7280', stepSize: 20 },
            border: { display: false },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    };

    this.chartInstance = new Chart(ctx, config);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewAllAppointments() {
    this.router.navigate(['/admin/appointments']);
  }

  newAppointment() {
    this.router.navigate(['/admin/appointments/new']);
  }

  viewReport() {
    this.router.navigate(['/admin/reports']);
  }
}