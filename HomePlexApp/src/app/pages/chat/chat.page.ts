import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { UsersService } from 'src/app/services/users/users.service';


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
 
   name;



  constructor(private usersService: UsersService,
              private navController: NavController) {}

  ngOnInit() {
    this.usersService.getAllUsersWithoutThisUser().subscribe(res =>{
      //console.log(res)
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
