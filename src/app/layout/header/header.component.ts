import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { InConfiguration, AuthService } from '@core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

//decorador del componente
@Component({
  selector: 'app-header', //etiqueta del componente
  templateUrl: './header.component.html', //archivo HTML asociado
  styleUrls: ['./header.component.scss'], //archivo SCSS
  standalone: true,
  imports: [ //modulos y componentes importados para usar en el HTML
    RouterLink,
    NgClass,
    MatButtonModule,
    MatMenuModule,
    FeatherIconsComponent,
  ],
})
export class HeaderComponent implements OnInit {
  public config!: InConfiguration;
  isNavbarCollapsed = true;
  isOpenSidebar?: boolean; //estado del sidebar (si está abierto o no)
  docElement?: HTMLElement;
  isFullScreen = false; //dice si el modo pantalla completa está activo o no
  // authService: any;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document, //inyecta el objeto global document
    private readonly renderer: Renderer2, 
    public readonly elementRef: ElementRef, //referencia al elemento HTML del componente
    private readonly configService: ConfigService, 
    private readonly authService: AuthService, 
    private readonly router: Router
  ) {
    //se obtiene el nombre del usuario autenticado desde el almacenamiento de sesión
    this.userLogged = this.authService.getAuthFromSessionStorage().nombre;
  }

  //variable para mostrar el nombre del usuario
  userLogged: string | undefined = '';
   
  //se ejecuta al inicializar el componente
  ngOnInit() {
    //carga la configuracion general
    this.config = this.configService.configData;
    this.docElement = document.documentElement;
  }

  //permite alternar el modo de pantalla completa
  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen(); //salir de pantalla completa
    }
    this.isFullScreen = !this.isFullScreen; //alterna el estado
  }

  //permite abrir o cerrar el menu lateral
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      //si ya tiene la clase, la elimina del body
      this.renderer.removeClass(this.document.body, className);
    } else {
      //si no tiene la clase, la agrega al body
      this.renderer.addClass(this.document.body, className);
    }
  }

  //alterna el estado del menu lateral
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      //si esta reducido lo expande
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false'); //guarda estado en localStorage
    } else {
      //si esta expandido lo reduce
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true'); //guarda estado en localStorage
    }
  }

  //cierra sesion
  logout() {
    this.authService.logout(); //llama al logout desde autenticacion
  }
}
