// src/app/shared/pages/not-found/not-found.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  template: `
    <ion-content class="not-found-content">
      <div class="not-found-container">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe o fue movida.</p>
        <ion-button routerLink="/login" expand="block" color="primary">
          Ir a Inicio de Sesión
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .not-found-content {
        --background: #f4f7f6;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
      .not-found-container {
        text-align: center;
        padding: 20px;
      }
      h1 {
        font-size: 80px;
        font-weight: 700;
        color: #0f766e;
        margin: 0;
      }
      h2 {
        font-size: 24px;
        color: #1a2e2b;
      }
      p {
        color: #6b7280;
        margin-bottom: 24px;
      }
    `,
  ],
})
export class NotFoundPage {}