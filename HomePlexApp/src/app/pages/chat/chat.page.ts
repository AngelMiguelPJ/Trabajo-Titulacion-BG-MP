import { collectExternalReferences, identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AbstractControlDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { concatAll, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService, usuarios } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

   // arreglo de usuarios
   // variables
   uid;
   users = [];
   list = [];
   name;
   collectionAliquots = { count: 0, data: [] }
   collectionAliquots2 = { count: 0, data: [] }
   idUserCurrent;


  constructor(private usersService: UsersService, private angularFirestore: AngularFirestore,
    private navController: NavController) {
      
    }

  ngOnInit() {

    this.usersService.getAllUsersWithoutThisUser().subscribe(res =>{
      console.log(res)
      this.users = res
    })

  }


  gotoChatRoom(uid,name,img){
    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)
    sessionStorage.setItem('imgContact', img)
    this.navController.navigateForward("/chatroom")  
  }


}
