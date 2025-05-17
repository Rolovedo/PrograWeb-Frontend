import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable() //marca la clase como inyectable para el sistema de dependencias de angular
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {} //inyecta el servicio de autenticacion

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          //auto logout si la api responde con error 401
          this.authenticationService.logout(); //cerrar sesion del usuario
          location.reload(); //recarga la pagina para limpiar el estado de la aplicacion
        }

        const error = err.error.message || err.statusText; //extrae el mensaje de error o el estado por defecto
        return throwError(error); //lanza el error para que pueda ser manejado 
      })
    );
  }
}
