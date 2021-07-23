import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';

import { UsersService } from 'src/app/services/users/users.service';
import { ChatroomPage } from '../chatroom/chatroom.page';

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
  usersBackUp = [];
  name;
  searchBarOpen = false;
  searchValue = false;

  collection;

  constructor(private usersService: UsersService,
              private navController: NavController,
              private loadingController: LoadingController,
              private chatService: ChatService, ) {}

  ngOnInit() {

    this.usersService.getAllUsersWithoutThisUser().subscribe(res => {
      // console.log(res)
      this.users = res;
      this.usersBackUp = res;

    });


  }

  async filterList(evt) {
    this.users = this.usersBackUp;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.users = this.users.filter(current => {
      if (current.Name && searchTerm) {
        return (current.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }

  gotoChatRoom(uid, name, img) {

    this.searchValue = true;
    sessionStorage.setItem('uidContact', uid);
    sessionStorage.setItem('nameContact', name);
    sessionStorage.setItem('imgContact', img);
    this.navController.navigateForward('/chatroom');

  }

}
