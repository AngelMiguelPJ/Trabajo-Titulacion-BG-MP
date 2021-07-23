import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // contructor
  constructor(private angularFireAuth: AngularFireAuth,
              private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // mapear datos
    return this.angularFireAuth.authState.pipe(map(auth => {

      // condicional
      if (isNullOrUndefined(auth)) {
        this.router.navigateByUrl('/login');
        return false;
      } else {
        return true;
      }
      // console.log(auth);
      // return false;
    }));
  }

}
