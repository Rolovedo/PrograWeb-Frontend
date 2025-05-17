import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';

//rutas principales de la aplicacion
export const APP_ROUTE: Route[] = [
  {
    //ruta raiz de la aplicacion
    path: '',
    component: MainLayoutComponent,
    //protege las rutas hijas usando el guardia de autenticacion
    canActivate: [AuthGuard],
    children: [
      {
        //ruta para el modulo de dashboard
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },
      {
        //ruta para el modulo de paginas
        path: 'page',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PAGES_ROUTE),
      },
    ],
  },
  {
    //ruta para el modulo de autenticacion
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
];
