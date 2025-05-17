import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //almacena la url actual sin la ruta completa
  currentUrl!: string;

  constructor(public _router: Router) {
    //se suscribe a los eventos de navegacion del router
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        //extrae la ultima parte de la ruta para almacenarla en currentUrl
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        //sin accion en el final de la navegacion
      }
      //hace scroll al tope de la pagina despues de cada evento
      window.scrollTo(0, 0);
    });
  }
}
