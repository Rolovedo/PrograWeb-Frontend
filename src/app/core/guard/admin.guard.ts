import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' //registra el guard como un servicio disponible globalmente
})
export class AdminGuard implements CanActivate {

    constructor(private readonly _authService: AuthService, private readonly _router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        
        const userSession = this._authService.getAuthFromSessionStorage(); //obtiene los datos del usuario desde el sessionStorage
        console.log(userSession); //muestra los datos del usuario en consola para depuracion
        
        if (userSession && userSession.rol_id === 1) { //verifica si existe el usuario y si tiene rol de administrador 1
            return true; //permite el acceso a la ruta protegida
        } else {
            this._router.navigate(['/authentication/page404']); //redirecciona a la pagina 404 si no es administrador
            return false; //bloquea el acceso
        }
    }
}
