import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UsersService } from 'src/app/services/users/users.service';
import { DatePipe } from '@angular/common'
import { ScrollToBottomDirective } from 'src/app/directives/scroll-to-bottom.directive'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('textMsg') inputName;
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  // arreglo de usuarios
  usersList = [];
  usersListBackup = [];
  userUid;
  // variables para el seteo de datos principales
  name;
  ouid;
  uid;

  // seteo de los chats
  chats = [];

  // iniciar servicios
  constructor(private usersService: UsersService, private angularFirestore: AngularFirestore,
    private route: Router, private chatService: ChatService,
    private datepipe: DatePipe) {

    // iniciacion de las variables princiaples
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');

    // seteo de la variable uid del usuario actual
    this.uid = localStorage.getItem('userId');

  }

  ngOnInit(): void {

    // seteo de la variable uid del usuario actual para diferencia en html
    this.userUid = localStorage.getItem('userId');

    // llamado al servico para la obtencion de los usuarios
    this.usersService.getUsersService().subscribe(users => {
      // seteo de los datos en el arreglo usuarios
      this.usersList = users;

    })

    this.usersService.getUsersService().subscribe(users => {
      // seteo de los datos en el arreglo usuarios
      this.usersListBackup = users;

    })

    // llamado al servicio para la obtencion de los chats
    this.chatService.getChatService().subscribe(chats => {

      // seteo de los chat en el arreglo chats
      this.chats = chats;

    })
  }


  // Funcion - metodo para actualizar el panel derecho del chat de acuerdo al usuario
  gotoChatRoom(uid, name) {

    //console.log(uid)
    //console.log(name)
    // seteo de variables principales en el sessionstorage
    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)

    // funcion para refrescar componete actual por medio de ruta
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);

  }

  // funcion - metodo para el envio de mensajes
  send(textMsg: string) {
    //console.log(textMsg)
    //console.log(textMsg.length)
    // agregar mensajes por medio del servicio de firestore del usuario actual a otro
    
    
    if (textMsg != '' ) {
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
        this.inputName.nativeElement.value = '';
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
        this.inputName.nativeElement.value = '';
      })
    }
   

  }

  validarTecla(e, textMsg: string){
    //console.log(e);
    //console.log(textMsg.length)
    if (textMsg.length == 0) {
      var key = e.keyCode ? e.keyCode : e.which;
		if (key == 32) {return false;}
    }
    
  }

  async filterList(evt) {
    //console.log(evt.srcElement.value)
    this.usersList = this.usersListBackup;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.usersList = this.usersList.filter(currentFood => {
      if (currentFood.Name && searchTerm) {
        return (currentFood.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
