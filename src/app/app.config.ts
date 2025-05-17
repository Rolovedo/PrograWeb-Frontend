import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { APP_ROUTE } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtInterceptor } from '@core/interceptor/jwt.interceptor';

//configuracion principal de la aplicacion
export const appConfig: ApplicationConfig = {
  providers: [
    //provee el cliente http sin interceptores personalizados
    provideHttpClient(),
    //provee las rutas principales de la aplicacion
    provideRouter(APP_ROUTE),
    //habilita animaciones del navegador
    provideAnimations(),
    //configura el uso de rutas con path en lugar de hash
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    //define el adaptador de fechas basado en moment
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      //formato de fechas personalizado para los componentes de angular material
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY MMM',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY MMM',
        },
      },
    },
    //interceptor jwt para manejar tokens en peticiones http
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //importa todos los iconos de feather
    importProvidersFrom(FeatherModule.pick(allIcons)),
    //configura los graficos usando ng2-charts
    provideCharts(withDefaultRegisterables()),
    //provee el cliente http con interceptores desde la inyeccion de dependencias
    provideHttpClient(withInterceptorsFromDi()),
    //habilita animaciones asincronas para mejorar el rendimiento
    provideAnimationsAsync(),
  ],
};
