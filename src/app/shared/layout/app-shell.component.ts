import {
  Component,
  Input,
  HostListener,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {  SidebarComponent } from '../sidebar/sidebar.component';

import {  AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  
  imports: [
    CommonModule,
    IonicModule,
    SidebarComponent,
    AdminSidebarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class AppShellComponent implements OnInit {

  @Input() 
  role: 'client' | 'admin' = 'client';

  isMobile = false;

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobile = window.innerWidth <= 992;
  }

}