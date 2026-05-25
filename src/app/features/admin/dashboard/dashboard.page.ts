import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from 'src/app/shared/admin-sidebar/admin-sidebar.component';
import { addIcons } from 'ionicons';
import {  searchOutline  } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterOutlet, AdminSidebarComponent]
})
export class DashboardPage {
  
  constructor() {

    addIcons({
      searchOutline
    });

  }
  
}