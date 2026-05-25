import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { TopbarComponent } from 'src/app/shared/topbar/topbar.component';


@Component({
  selector: 'app-client-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    SidebarComponent,
    TopbarComponent,
    RouterOutlet
  ]
})
export class DashboardPage {

}