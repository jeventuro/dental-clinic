import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProfilePage {

   patient = {

    fullName: 'Carlos Ramírez',

    dni: '74859621',

    phone: '+51 987 654 321',

    email: 'carlos@gmail.com',

    address: 'Av. Primavera 254 - Lima',

    emergencyContact: 'María Ramírez',

    bloodType: 'O+',

    allergies: 'Ninguna',

    notifications: true,

    darkMode: false,

    biometricLogin: true

  };

  saveProfile() {
    console.log('Perfil actualizado', this.patient);
  }

  logout() {
    console.log('Cerrar sesión');
  }

}
