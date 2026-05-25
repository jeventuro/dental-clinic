import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';


import {
  homeOutline,
  calendarOutline,
  walletOutline,
  medicalOutline,
  settingsOutline,
  logOutOutline,
  personOutline,
  notificationsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    RouterLinkActive,  ]
})
export class SidebarComponent {

  constructor(private router: Router) {

    addIcons({
      homeOutline,
      calendarOutline,
      walletOutline,
      medicalOutline,
      settingsOutline,
      logOutOutline,
      personOutline,
      notificationsOutline
    });

  }
  sidebar(){
    this.router.navigate(['/login']);
  }

}