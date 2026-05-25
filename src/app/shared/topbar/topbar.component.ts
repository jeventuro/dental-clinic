import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';

import {
  notificationsOutline,
  searchOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class TopbarComponent {

  constructor() {

    addIcons({
      notificationsOutline,
      searchOutline
    });

  }

}
