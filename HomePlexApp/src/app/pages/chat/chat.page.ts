import { collectExternalReferences, identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AbstractControlDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { concatAll, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

   // arreglo de usuarios
  usersList = [];
  userUid;
 


  constructor(private usersService: UsersService, private angularFirestore: AngularFirestore,
    private navController: NavController) {}

  ngOnInit() {

    // seteo de la variable uid del usuario actual para diferencia en html
    this.userUid = localStorage.getItem('userId');

    // llamado al servico para la obtencion de los usuarios
    

    this.usersService.getUsersService().subscribe(userData => {
      userData.forEach(childData => {
        if (childData.id != this.userUid) {
          this.usersList.push(childData) 
        }
      })
    })
  }


  gotoChatRoom(uid,name,img){
    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)
    sessionStorage.setItem('imgContact', img)
    this.navController.navigateForward("/chatroom")  
  }


}
