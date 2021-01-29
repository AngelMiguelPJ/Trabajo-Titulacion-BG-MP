import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {


  // variables
  userUid;
  usersList = [];
  name;
  ouid;
  uid;
  chats = [];
  nameCurrUser;
  constructor(private usersService: UsersService,
    private angularFirestore: AngularFirestore, private route: Router,
    private chatService: ChatService) {
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.uid = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.userUid = localStorage.getItem('userId')

    this.usersService.getUsersService().subscribe(users => {
      this.usersList = users;   
    })
    this.chatService.getChatService().subscribe(chats =>{
      this.chats = chats;
    })
  }

  gotoChatRoom(uid, name) {
    console.log(uid)
    console.log(name)
    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  send(textMsg: string) {

    this.angularFirestore.collection("chats").doc(this.uid).collection(this.ouid).add({
      time: Date.now(),
      uid: this.uid,
      msg: textMsg
    }).then(() => {
      textMsg = "";
    })

    this.angularFirestore.collection("chats").doc(this.ouid).collection(this.uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: textMsg
    }).then(() => {
      textMsg = "";
    })
  }






}
