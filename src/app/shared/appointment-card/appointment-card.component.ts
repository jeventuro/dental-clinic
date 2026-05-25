import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'
@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
  imports : [CommonModule, IonicModule]
})
export class AppointmentCardComponent {
  @Input() doctor!: string;

  @Input() specialty!: string;

  @Input() date!: string;

  @Input() hour!: string;

  @Input() status!: string;

}
