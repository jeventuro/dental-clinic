import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PaymentsPage {
   pendingPayments = [
    {
      treatment: 'Ortodoncia Premium',
      amount: 'S/ 320',
      dueDate: '25 Mayo 2026',
      status: 'Pendiente'
    },
    {
      treatment: 'Limpieza Dental',
      amount: 'S/ 80',
      dueDate: '30 Mayo 2026',
      status: 'Pendiente'
    }
  ];

  paymentHistory = [
    {
      treatment: 'Implantes Dentales',
      amount: 'S/ 1200',
      date: '12 Abril 2026',
      method: 'Visa'
    },
    {
      treatment: 'Blanqueamiento',
      amount: 'S/ 250',
      date: '28 Marzo 2026',
      method: 'Yape'
    },
    {
      treatment: 'Consulta General',
      amount: 'S/ 70',
      date: '10 Marzo 2026',
      method: 'MasterCard'
    }
  ];

  paymentMethods = [
    {
      type: 'Visa',
      number: '**** **** **** 4552'
    },
    {
      type: 'Yape',
      number: '+51 987 654 321'
    }
  ];

  }


