import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // mapear datos
    return this.angularFireAuth.authState.pipe(map(auth => {

      // condicional
      if (isNullOrUndefined(auth)) {
        this.authService.isAuthenticated = false
        return true
      } else {
        this.authService.isAuthenticated = true
        this.router.navigate(['/home']);
        return false
      }
      //console.log(auth);
      return false;
    }))
  }
  
}
