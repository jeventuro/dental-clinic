import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-treatment-card',
  templateUrl: './treatment-card.component.html',
  styleUrls: ['./treatment-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TreatmentCardComponent {

  @Input() title!: string;

  @Input() doctor!: string;
  
  @Input() progress!: number;

  @Input() nextSession!: string;
  
  @Input() status!: string;

}
