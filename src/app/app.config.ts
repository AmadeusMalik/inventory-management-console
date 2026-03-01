import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
// PrimeNG Configuration
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
MessageService
// This file is for application-wide configuration and providers.
// You can add services, interceptors, or any other providers here that should be available throughout the app.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    MessageService, // Make MessageService available app-wide for Toasts
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
