import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';

import {
  notificationsOutline,
  settingsOutline,
  calendarOutline,
  calendarClearOutline,
  businessOutline,
  personOutline,
  medicalOutline,
  documentTextOutline
} from 'ionicons/icons';

interface QuickAction {
  title: string;
  icon: string;
  route: string;
  color: string;
}

interface Reminder {
  title: string;
  description: string;
  date: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-dash-view',
  templateUrl: './dash-view.page.html',
  styleUrls: ['./dash-view.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})


export class DashViewPage {

  public patientName = 'Jeremy';

  public nextAppointment = {
    treatment: 'Limpieza Dental Avanzada',
    doctor: 'Dr. Carlos Mendoza',
    specialty: 'Especialista en Estética',
    date: '14 Oct, 09:30 AM',
    branch: 'San Isidro, Lima'
  };

  public quickActions: QuickAction[] = [
    {
      title: 'Agendar cita',
      icon: 'calendar-outline',
      route: '/client-dashboard/appointments',
      color: '#0ea5e9'
    },
    {
      title: 'Mis citas',
      icon: 'calendar-clear-outline',
      route: '/client-dashboard/appointments',
      color: '#10b981'
    },
    {
      title: 'Sedes',
      icon: 'business-outline',
      route: '/client-dashboard/locations',
      color: '#f59e0b'
    },
    {
      title: 'Perfil',
      icon: 'person-outline',
      route:'/client-dashboard/profile',
      color: '#6366f1'
    }
  ];

  public reminders: Reminder[] = [
    {
      title: 'Medicación diaria',
      description: 'Tomar enjuague bucal fluorurado',
      date: 'Hoy, 8:00 PM',
      color: '#16a34a',
      icon: 'medical-outline'
    },
    {
      title: 'Resultados de laboratorio',
      description: 'Radiografía panorámica disponible',
      date: 'Mañana, 10:00 AM',
      color: '#2563eb',
      icon: 'document-text-outline'
    },
    {
      title: 'Control preventivo',
      description: 'Chequeo semestral odontológico',
      date: 'En 3 días',
      color: '#b45309',
      icon: 'calendar-clear-outline'
    }
  ];

  constructor( private router: Router ) {

    addIcons({
      notificationsOutline,
      settingsOutline,
      calendarOutline,
      calendarClearOutline,
      businessOutline,
      personOutline,
      medicalOutline,
      documentTextOutline
    });

  }

  /**
   * Centralizador de navegación con validación de rutas y control de excepciones corporativo.
   * @param route Dirección de destino absoluta
   */
  public navigate(route: string): void {
    if (!route) {
      console.error('Navegación rechazada: La ruta especificada está vacía.');
      return;
    }

    this.router.navigate([route]).catch((error) => {
      console.error(`Error crítico al redirigir a la ruta [${route}]:`, error);
    });
  }
}
