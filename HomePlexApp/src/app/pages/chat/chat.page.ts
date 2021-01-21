import { collectExternalReferences, identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AbstractControlDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { concatAll, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

   // variables
   uid;
   users = [];
   name;

  constructor(private router: Router,
    private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private navController: NavController) {

      this.uid = localStorage.getItem('userId');
      console.log(this.uid)
  
      //
      this.angularFirestore.collection("users").get().subscribe(userData => {
        userData.forEach(childData => {
          if (childData.data()['Uid'] != this.uid) {
            this.users.push(childData.data())
            console.log(this.users)  
          }
        })
      })
  
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logoutService()
    localStorage.clear()
    sessionStorage.clear()
  }

  gotoChatRoom(uid,name){
    sessionStorage.setItem("uid", uid);
    sessionStorage.setItem("name", name);
    this.navController.navigateForward("/chatroom")  
  }


}
