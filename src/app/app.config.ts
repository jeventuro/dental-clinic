// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withDebugTracing } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '@env/environment';

// Importa interceptores si los tienes
// import { authInterceptor } from '@core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ==========================================================
    // IONIC - Configuración principal
    // ==========================================================
    provideIonicAngular({
      mode: 'md',
      // Puedes añadir más configuraciones aquí
    }),

    // ==========================================================
    // ROUTER - Configuración de enrutamiento
    // ==========================================================
    provideRouter(
      routes,
      // Pre-carga todos los módulos en segundo plano (mejora UX)
      withPreloading(PreloadAllModules),
      // Activar trazado de rutas solo en desarrollo (opcional)
      ...(environment.production ? [] : [withDebugTracing()])
    ),

    // ==========================================================
    // HTTP CLIENT - Para peticiones a API
    // ==========================================================
    provideHttpClient(
      // withInterceptors([authInterceptor]), // 👈 descomenta cuando tengas interceptores
    ),

    // ==========================================================
    // OTROS PROVIDERS (servicios globales, guards, etc.)
    // ==========================================================
    // Si necesitas importar módulos que no son standalone:
    // importProvidersFrom(SomeModule),
  ],
};