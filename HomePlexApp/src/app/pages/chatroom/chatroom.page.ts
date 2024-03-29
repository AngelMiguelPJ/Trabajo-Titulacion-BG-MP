import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;

  // variables para el seteo de datos principales
  name;
  ouid;
  uid;
  letras;
  img;
  fecha;

  // seteo de los chats
  chats = [];
  mensajeHora: string;
  spaceValid = false;

  constructor(private angularFirestore: AngularFirestore,
    private router: Router, private chatService: ChatService,
    public _zone: NgZone, public toastController: ToastController) {
    // iniciacion de las variables princiaples
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.img = sessionStorage.getItem('imgContact')

    // seteo de la variable uid del usuario actual
    this.uid = localStorage.getItem('userId');
    this.scrollToBottom();

  }

  ngOnInit() {

    // llamado al servicio para la obtencion de los chats
    this.chatService.getChatService().subscribe(chats => {

      const fechaActual = new Date().toLocaleDateString();
      //console.log(fechaActual)
      // seteo de los chat en el arreglo chats
      this.chats = chats;
      for (let index = 0; index < this.chats.length; index++) {
        const fechaActual = new Date().toLocaleDateString();
        const element = this.chats[index]['fecha'];
        //console.log(element)
        if (element == fechaActual) {
          this.chats[index]['fecha'] = 'hoy'
        }
      }

    })

    this.scrollToBottom();
  }

  scrollToBottom() {
    this._zone.run(() => {

      const duration: number = 500;

      setTimeout(() => {

        this.content.scrollToBottom(duration).then(() => {

          setTimeout(() => {

            this.content.getScrollElement().then((element: any) => {

              if (element.scrollTopMax != element.scrollTop) {
                // trigger scroll again.
                this.content.scrollToBottom(duration).then(() => {

                  // loaded... do something

                });
              }
              else {
                // loaded... do something
              }
            });
          });
        });

      }, 20);
    });
  }

  send(textMsg: any) {
    var array = textMsg.split('');
    console.log(array)
    if (array.length > 0) {
      //console.log('si')
      for (let index = 0; index < array.length; index++) {
        if (array[index] === " ") {
          //console.log('vacio')
          this.spaceValid = false;
        }else{
          //console.log('no vacio')
          this.spaceValid = true
          
        }
        
      }
      if (this.spaceValid == true) {
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
          this.letras = '';
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
          this.letras = '';
        })
        this.scrollToBottom();
      } else if(this.spaceValid == false){
        this.msgVacio()
      }
    }else{
      this.msgVacio();
    }
    this.scrollToBottom();

    

    // agregar mensajes por medio del servicio de firestore del usuario actual a otro


  }



  chatTabPage() {
    this.img = sessionStorage.removeItem('imgContact')
    this.name = sessionStorage.removeItem("nameContact");
    this.ouid = sessionStorage.removeItem('uidContact');
    this.router.navigateByUrl('/chat')

  }

  async msgVacio() {
    const toast = await this.toastController.create({
      message: 'No puede enviar un mensaje vacio',
      duration: 500,
      position: 'middle'
    });
    toast.present();
  }

}
