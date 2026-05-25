import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class StatsCardComponent {

  @Input() title!: string;

  @Input() value!: string;

  @Input() icon!: string;

  @Input() color!: string;

}