import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {

  
    // variables para el seteo de datos principales
    name;
    ouid;
    uid;
    letras;
    img;
  
    // seteo de los chats
    chats = [];

  constructor(private angularFirestore: AngularFirestore,
    private router: Router, private chatService: ChatService,) {
    // iniciacion de las variables princiaples
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.img = sessionStorage.getItem('imgContact')

    // seteo de la variable uid del usuario actual
    this.uid = localStorage.getItem('userId');

    
  }

  ngOnInit() {
    
    // llamado al servicio para la obtencion de los chats
    this.chatService.getChatService().subscribe(chats => {

      // seteo de los chat en el arreglo chats
      this.chats = chats;

    })
  }

  send(textMsg: string) {


    // agregar mensajes por medio del servicio de firestore del usuario actual a otro
    this.angularFirestore.collection("chats").doc(this.uid).collection(this.ouid).add({
      time: Date.now(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      }),
      uid: this.uid,
      msg: textMsg,
    }).then(() => {
      this.letras = ''
    })

    // agregar mensajes por medio del servicio de firestore de otro usuario al actual
    this.angularFirestore.collection("chats").doc(this.ouid).collection(this.uid).add({
      time: Date.now(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      }),
      uid: this.uid,
      msg: textMsg,
    }).then(() => {
      this.letras = ''
    })

  }

  chatTabPage() {
    this.router.navigate(['/tabs/tabchat'])
  }

}
