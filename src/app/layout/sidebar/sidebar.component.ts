import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { ROUTES } from './sidebar-items';

import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    RouterLinkActive,
    NgClass,
  ],
})
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  public sidebarItems!: RouteInfo[]; //items visibles en el menu lateral segun el rol
  public innerHeight?: number; //altura de la ventana interna del navegador
  public bodyTag!: HTMLElement; //referencia al body del documento
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60; //altura fija del encabezado
  currentRoute?: string; //ruta actual activa

  userLogged: string | undefined = ''; //nombre del rol del usuario autenticado

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _renderer: Renderer2,
    public readonly _elementRef: ElementRef,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _domSanitizer: DomSanitizer
  ) {
    super();
    //se cierra el sidebar automaticamente al cambiar de ruta en dispositivos moviles
    this.subs.sink = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this._renderer.removeClass(this._document.body, 'overlay-open');
      }
    });
    //obtiene el nombre del rol del usuario para mostrar en la interfaz
    const roleInfo = this._authService.getRoleInfoByToken();
    this.userLogged = roleInfo ? roleInfo.roleName : undefined;
  }

  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight(); //ajusta la altura del menu
    this.checkStatuForResize(false); //verifica el tamaño de pantalla
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    //cierra el menu si se hace clic fuera del componente
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this._renderer.removeClass(this._document.body, 'overlay-open');
    }
  }

  callToggleMenu(event: Event, length: number): void {
    //controla la expansion o colapso de los elementos del menu
    if (!this.isValidLength(length) || !this.isValidEvent(event)) {
      return;
    }

    const parentElement = (event.target as HTMLElement).closest('li');
    if (!parentElement) {
      return;
    }

    const activeClass = parentElement.classList.contains('active');

    if (activeClass) {
      this._renderer.removeClass(parentElement, 'active');
    } else {
      this._renderer.addClass(parentElement, 'active');
    }
  }

  private isValidLength(length: number): boolean {
    return length > 0; //valida que el menu tenga elementos
  }

  private isValidEvent(event: Event): boolean {
    return event && event.target instanceof HTMLElement; //valida que el evento sea valido
  }

  sanitizeHtml(html: string): SafeHtml {
    return this._domSanitizer.bypassSecurityTrustHtml(html); //evita vulnerabilidades al renderizar html dinamico
  }

  ngOnInit() {
    //filtra los elementos del menu segun el rol del usuario
    const rolAuthority = this._authService.getAuthFromSessionStorage().rol_id;
    this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem?.rolAuthority.includes(rolAuthority));
    this.initLeftSidebar(); //inicializa comportamiento del sidebar
    this.bodyTag = this._document.body;
  }


  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    _this.setMenuHeight(); //define altura del menu
    _this.checkStatuForResize(true); //verifica el estado de la pantalla
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + ''; //asigna altura calculada al menu
    this.listMaxWidth = '500px'; //ancho fijo para el menu
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open'); //verifica si el sidebar esta abierto
  }

  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this._renderer.addClass(this._document.body, 'ls-closed'); //cierra sidebar en pantallas pequeñas
    } else {
      this._renderer.removeClass(this._document.body, 'ls-closed'); //abre sidebar en pantallas grandes
    }
  }

  mouseHover() {
    //maneja el comportamiento visual cuando el mouse pasa sobre el menu cerrado
    const body = this._elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this._renderer.addClass(this._document.body, 'side-closed-hover');
      this._renderer.removeClass(this._document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    //restaura el estado del menu al quitar el mouse
    const body = this._elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this._renderer.removeClass(this._document.body, 'side-closed-hover');
      this._renderer.addClass(this._document.body, 'submenu-closed');
    }
  }
}
