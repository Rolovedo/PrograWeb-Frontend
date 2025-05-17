import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //almacena la url base de los servicios
  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  createUser(userData: any): Observable<any> {
    //crea un nuevo usuario con los datos proporcionados
    const endpoint = `${this.urlBaseServices}/api/v1/users/create`;
    return this.http.post<any>(endpoint, userData);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    //actualiza un usuario existente segun su id
    const endpoint = `${this.urlBaseServices}/api/v1/users/update/${userId}`;
    return this.http.put<any>(endpoint, userData);
  }

  deleteUser(userId: number): Observable<any> {
    //elimina un usuario segun su id
    const endpoint = `${this.urlBaseServices}/api/v1/users/delete/${userId}`;
    return this.http.delete<any>(endpoint);
  }

  getAllUsersByAdministrator(filters?: any): Observable<any> {
    //obtiene todos los usuarios filtrando por nombre y correo si se proporcionan
    const endpoint = `${this.urlBaseServices}/api/v1/users`;
    const params = new HttpParams({ fromObject: {
      nombre: filters?.name || '',
      email: filters?.email || ''
    }});
    return this.http.get<any>(endpoint, { params });
  }

  getAllAdministrator(): Observable<any> {
    //obtiene todos los usuarios con rol de administrador
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/1`;
    return this.http.get<any>(endpoint);
  }

  getAllUsers(): Observable<any> {
    //obtiene todos los usuarios con rol de usuario estandar
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/2`;
    return this.http.get<any>(endpoint);
  }
}
