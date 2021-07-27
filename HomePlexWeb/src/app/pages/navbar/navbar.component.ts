//importacion de librerias a usar
import { Component, OnInit } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';

// servicios de autenticacion y usuarios
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';

// librerias, servicios extras
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  // variables para el mapeo de datos para este usuario actual
  userUid;
  usersList = [];

  // Variables para el seteo de los datos del usuario actual y reflejarlos en html
  uid;
  nameUserInfor;
  emailUserInfor;
  imgUserInfor;

  // constructor que inicia lso servicios o funciones
  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,
    private router: Router,) { }

  ngOnInit(): void {

    // Seteo de la variable uid del usuario local alojada en el localstorage
    this.userUid = localStorage.getItem('userId')

    // Llamado al servicio de usuarios para obtener datos de acuerdo al usuario actual
    this.usersService.getUsersService().subscribe(users => {
      // seteo de datos en un arreglo
      this.usersList = users
      // condicion for para recorrer el arreglo
      for (let index = 0; index < this.usersList.length; index++) {
        // igualacion de cada indice del arreglo a una variable mientras recorre
        const uides = this.usersList[index];
        // condicional para obtener solo los datos del usuario actual
        if (uides.Uid === this.userUid) {
          // seteo de los datos pertinentes al usuario actual
          this.nameUserInfor = uides.Name,
          this.emailUserInfor = uides.Email,
          this.imgUserInfor = uides.Img     
        }
      }
    })

  }

  // funcion - metodo para cerrar sesion
  logout() {

    // llamado al servio de cerrado de sesion
    this.authService.logoutService();

  }

  basura(){
    this.router.navigate(['/schedule-trash']);
  }

}
