import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../../services/users/users.service'
@Injectable()
export class SecurityGuard implements CanActivate {
  
  constructor(private user: UsersService, private router: Router) { }
  
  public canActivate() {
    //console.log('1:' + this.user.isAdmin)
    if (!this.user.isAdmin && !this.user.isAccountant) //Obtenemos en nuestro servicio el rol y nos fijamos si es igual o no al de 'Admin 
    {
      //console.log('2:' + this.user.isAdmin)
      //alert('Usted no posee permisos para acceder a esta ruta');
      this.router.navigate(['/']); //Lo enviamos a la página que queramos
      return false;
    } //console.log('3:' + this.user.isAdmin)
    return true; //Este camino deja continuar con la vista con normalidad
    //console.log('4:' + this.user.isAdmin)
  }
}