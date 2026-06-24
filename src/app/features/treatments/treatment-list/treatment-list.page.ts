import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.page.html',
  styleUrls: ['./treatment-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TreatmentListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
