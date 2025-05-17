import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

//decorador del componente
@Component({
  selector: 'app-page404', //inserta el componente en HTML
  templateUrl: './page404.component.html', //ruta del archivo de HTML
  styleUrls: ['./page404.component.scss'], //ruta del archivo de SCSS
  standalone: true,
  imports: [
    FormsModule, //manejo de formularios
    MatButtonModule, //usa botones de angular material
  ],
})
export class Page404Component {
  //constructor del servicio del router
  constructor(
    private _router: Router //enrutamiento para redireccionar al usuario
  ) {}

  //redirige al usuario a la página principal del dashboard
  redirectHome() {
    this._router.navigate(['/dashboard/main']);
  }
}
