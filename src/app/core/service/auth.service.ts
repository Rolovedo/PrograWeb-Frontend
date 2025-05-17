import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '@core/models/config';
import { User } from '@core/models/user';
import * as jwt from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root', //hace que el servicio sea accesible globalmente en la aplicacion
})
export class AuthService {

  urlBaseServices: string = URL_SERVICIOS; //url base para los servicios del backend

  public get currentUserValue(): User{
    return this.currentUserSubject.value; //retorna el valor actual del usuario almacenado
  }

  private readonly currentUserSubject: BehaviorSubject<User>; //almacena el usuario actual de tipo BehaviorSubject
  public currentUser: Observable<User>; //exponer el usuario actual como un observable publico

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>({} as User); //inicializa el BehaviorSubject con un objeto vacio
    this.currentUser = this.currentUserSubject.asObservable(); //convierte el BehaviorSubject en un observable para otros componentes
  }

  login(email: string, password: string): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/auth/login`; //construye la url de la api para login
    return this.http.post<any>(endpoint, { email, password }); //realiza la peticion post para autenticar al usuario
  }

  isAuthenticated(): boolean {
    const accessToken = sessionStorage.getItem('accessToken'); //verifica si hay un token en sessionStorage
    return accessToken !== null; //devuelve true si el token existe
  }

  getAuthFromSessionStorage(): any {
    try {
      const lsValue = sessionStorage.getItem('accessToken'); //obtiene el token de sessionStorage
      if (!lsValue) {
        return undefined; //retorna undefined si no hay token
      }
      const decodedToken: any = jwt.jwtDecode(lsValue); //decodifica el token usando jwt-decode

      return decodedToken; //retorna el token decodificado
    } catch (error) {
      console.error(error); //muestra error en consola si algo falla
      return undefined; //retorna undefined si hay error
    }
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token); //guarda el token en sessionStorage
  }

  logout() {
    sessionStorage.removeItem('token'); //elimina el token del sessionStorage
    this.router.navigate(['/authentication/signin'], {
      queryParams: {}, //redirige al login
    });
  }

  getRoleInfoByToken(): { roleId: number, roleName: string } | undefined {
    //devuelve el rol del usuario autenticado a partir del token decodificado
    try {
      const decodedToken: any = this.getAuthFromSessionStorage(); //obtiene y decodifica el token
      const roleId = decodedToken.rol_id; //extrae el rol del token
      let roleName = ''; //inicializa el nombre del rol

      if (roleId === 1) {
        roleName = 'Administrador'; //asigna nombre para rol 1
      } else if (roleId === 2) {
        roleName = 'Usuario'; //asigna nombre para rol 2
      } else {
        return undefined; //retorna undefined si el rol no es valido
      }

      return { roleId, roleName }; //retorna objeto con rol id y nombre
    } catch (error) {
      console.error(error); //muestra error en consola si algo falla
      return undefined; //retorna undefined si hay error
    }
  }

}
