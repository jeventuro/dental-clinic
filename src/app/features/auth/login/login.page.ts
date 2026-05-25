import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  mailOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  calendarOutline,
  notificationsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private router: Router) {

    addIcons({
      mailOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      calendarOutline,
      notificationsOutline
    });

  }

  login() {

    // TEMPORAL
    if (this.email === 'admin@premium.com') {

      this.router.navigate(['/admin-dashboard']);

    } else {

      this.router.navigate(['/client-dashboard']);

    }

  }

}