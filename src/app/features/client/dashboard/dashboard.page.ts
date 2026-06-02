import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';

import { StatsCardComponent } from 'src/app/shared/stats-card/stats-card.component';
import { AppShellComponent } from 'src/app/shared/layout/app-shell.component';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterOutlet,

    
    AppShellComponent,
   
  ]
})
export class DashboardPage {

}