import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable() //marca la clase como inyectable para el sistema de dependencias
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthService) {} //inyecta el servicio de autenticacion

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('accessToken'); //obtiene el token almacenado en sessionStorage

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` //agrega el token en Authorization
        }
      });
    }

    return next.handle(req); //continua con la solicitud HTTP
  }
}
