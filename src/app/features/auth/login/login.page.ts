import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {

    // TEMPORAL por ahora 
    if (this.email === 'admin@premium.com') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/client-dashboard']);
    }

  }

}
