import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { businessOutline, pinOutline, callOutline, timeOutline, alertCircleOutline } from 'ionicons/icons';

interface DentalBranch {
  id: number;
  name: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  status: 'active' | 'upcoming'; // Control de estado para Chancay
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LocationsPage {

  public branches: DentalBranch[] = [
    {
      id: 1,
      name: 'Sede Huaral - Central',
      district: 'Huaral',
      address: 'Av. Solar 142 (Frente a la Plaza de Armas)',
      phone: '(01) 246-8102',
      hours: 'Lunes a Sábado: 8:00 AM - 8:00 PM',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sede Huaral - CliniDent',
      district: 'Huaral',
      address: 'Calle Derecha 455',
      phone: '(01) 246-3421',
      hours: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sede Comas',
      district: 'Comas, Lima',
      address: 'Av. Túpac Amaru 1230 (Al costado del Metro de Belaunde)',
      phone: '(01) 542-9081',
      hours: 'Lunes a Sábado: 8:00 AM - 9:00 PM',
      status: 'active'
    },
    {
      id: 4,
      name: 'Sede Chancay',
      district: 'Chancay',
      address: 'Av. Roosevelt 210',
      phone: 'Próximamente',
      hours: 'Próximamente',
      status: 'upcoming' // Se renderizará bloqueada y con etiqueta "Próximamente"
    }
  ];

  constructor() {
    addIcons({
      businessOutline,
      pinOutline,
      callOutline,
      timeOutline,
      alertCircleOutline
    });
  }
}