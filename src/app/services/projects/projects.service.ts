import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  //almacena la url base de los servicios
  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  createProject(projectData: any): Observable<any> {
    //crea un nuevo proyecto con los datos proporcionados
    const endpoint = `${this.urlBaseServices}/api/v1/projects/create`;
    return this.http.post<any>(endpoint, projectData);
  }

  updateProject(projectId: number, projectData: any): Observable<any> {
    //actualiza un proyecto existente segun su id
    const endpoint = `${this.urlBaseServices}/api/v1/projects/update/${projectId}`;
    return this.http.put<any>(endpoint, projectData);
  }

  deleteProject(projectId: number): Observable<any> {
    //elimina un proyecto segun su id
    const endpoint = `${this.urlBaseServices}/api/v1/projects/delete/${projectId}`;
    return this.http.delete<any>(endpoint);
  }

  getAllProjects(filters?: any): Observable<any> {
    //obtiene todos los proyectos aplicando filtros opcionales
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
    const params = new HttpParams({ fromObject: {
      nombre: filters?.nombre || '',
      estado: filters?.estado || '',
      categoria_id: filters?.categoria_id || '',
      cliente_id: filters?.cliente_id || ''
    }});
    return this.http.get<any>(endpoint, { params });
  }

  getProjectById(projectId: number): Observable<any> {
    //obtiene un proyecto especifico por su id
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}`;
    return this.http.get<any>(endpoint);
  }

  getProjectsByUser(userId: number): Observable<any> {
    //obtiene todos los proyectos asignados a un usuario especifico
    const endpoint = `${this.urlBaseServices}/api/v1/projects/user/${userId}`;
    return this.http.get<any>(endpoint);
  }

  getAllCategories(): Observable<any> {
    //obtiene todas las categorias de proyectos
    const endpoint = `${this.urlBaseServices}/api/v1/categories`;
    return this.http.get<any>(endpoint);
  }

  getAllClients(): Observable<any> {
    //obtiene todos los clientes
    const endpoint = `${this.urlBaseServices}/api/v1/clients`;
    return this.http.get<any>(endpoint);
  }

  assignUserToProject(projectId: number, userData: any): Observable<any> {
    //asigna un usuario a un proyecto
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/assign-user`;
    return this.http.post<any>(endpoint, userData);
  }

  removeUserFromProject(projectId: number, userId: number): Observable<any> {
    //remueve un usuario de un proyecto
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/remove-user/${userId}`;
    return this.http.delete<any>(endpoint);
  }

  getProjectStats(): Observable<any> {
    //obtiene estadisticas generales de los proyectos
    const endpoint = `${this.urlBaseServices}/api/v1/projects/stats`;
    return this.http.get<any>(endpoint);
  }
}
