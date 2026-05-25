import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink} from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline,cardOutline, callOutline, mailOutline, lockClosedOutline, medkitOutline, calendarClearOutline, phonePortraitOutline} from 'ionicons/icons';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class RegisterPage {

  
    name = '';
    dni = '';
    phone = '';
    email = '';
    password = '';
  

  constructor(private router: Router) {

    addIcons({
      personOutline,
      cardOutline,
      callOutline,
      mailOutline,
      lockClosedOutline,
      medkitOutline,
      calendarClearOutline,
      phonePortraitOutline
    });
  }
  
  register() {
    console.log({
      name: this.name,
      dni: this.dni,
      phone: this.phone,
      email: this.email,
      password: this.password
    });

    this.router.navigate(['/login']);

  }

}