import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AppointmentCardComponent } from 'src/app/shared/appointment-card/appointment-card.component';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, AppointmentCardComponent]
})
export class AppointmentsPage {
  appointments = [

    {
      doctor: 'Dr. Carlos Mendoza',
      specialty: 'Ortodoncia',
      date: '24 Mayo 2026',
      hour: '09:00 AM',
      status: 'Confirmada'
    },

    {
      doctor: 'Dra. Ana Torres',
      specialty: 'Implantes Dentales',
      date: '29 Mayo 2026',
      hour: '03:30 PM',
      status: 'Pendiente'
    }

  ];

}
