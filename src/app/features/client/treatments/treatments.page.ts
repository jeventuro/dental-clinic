import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TreatmentCardComponent } from 'src/app/shared/treatment-card/treatment-card.component';


@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.page.html',
  styleUrls: ['./treatments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TreatmentCardComponent]
})
export class TreatmentsPage {
  treatments = [

    {
      title: 'Ortodoncia',
      doctor: 'Dr. Carlos Mendoza',
      progress: 65,
      nextSession: '28 Mayo 2026',
      status: 'Activo'
    },

    {
      title: 'Implante Dental',
      doctor: 'Dra. Ana Torres',
      progress: 40,
      nextSession: '02 Junio 2026',
      status: 'En proceso'
    }

  ];
} 
 