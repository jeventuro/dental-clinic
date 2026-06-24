// src/app/shared/components/layout/app-shell.component.ts
import { Component, Input, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component'; // ✅ usando alias

@Component({
  selector: 'app-shell',
  standalone: true,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterOutlet,
    SidebarComponent,
    // si tienes AdminSidebarComponent, impórtalo aquí también
    // AdminSidebarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent implements OnInit {
  @Input() role: 'client' | 'admin' = 'client';
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