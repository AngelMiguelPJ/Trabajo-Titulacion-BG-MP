import { Component, OnInit } from '@angular/core';
//
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChildActivationEnd } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // variables para el mapeo de datos para este usuario actual
  userUid;
  usersList = [];

  // Variables para el seteo de los datos del usuario actual y reflejarlos en html
  uid;
  nameUserInfor;
  emailUserInfor;
  imgUserInfor;

  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,) {}


  ngOnInit() {

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

}
