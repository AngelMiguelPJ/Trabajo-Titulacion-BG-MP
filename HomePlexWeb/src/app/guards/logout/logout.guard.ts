import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  // contructor que inicia los servicios
  constructor(private angularFireAuth: AngularFireAuth, private router: Router,
              private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // mapear del estado del usuario
    return this.angularFireAuth.authState.pipe(map(auth => {

      // condicional que verifica si esta logeado o no
      if (isNullOrUndefined(auth)) {

        //si no esta logeado cambia el estado a false
        this.authService.isAuthenticated = false

        return true
      } else {

        // en caso de que si lo este cambia el estado a true
        this.authService.isAuthenticated = true

        // redirije a home
        this.router.navigate(['/home']);

        return false
      }

    }))
    
  }
  
}
