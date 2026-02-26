import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideNgxMask } from 'ngx-mask';
import { authInterceptor } from './services/tools/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideNgxMask(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};