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
export class AuthGuard implements CanActivate {

  // contructor
  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // mapear datos
    return this.angularFireAuth.authState.pipe(map(auth => {

      // condicional
      if (isNullOrUndefined(auth)) {
        this.authService.isAuthenticated = false
        this.router.navigate(['/login']);
        return false
      } else {
        this.authService.isAuthenticated = true
        return true
      }
      //console.log(auth);
      //return false;
    }))

  }

}
