import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  // variables para el seteo de datos principales
  // name: nombre de usuario,  ouid: id de otro usuario, id: id de usuario actual
  name;
  ouid;
  uid;

  // contructor para iniciar servicios de firestore
  constructor(private angularFirestore: AngularFirestore) { }

  // Metodo-funcion  para obtener los chat guardados de acuerdo al uid del usuario actual y otro usuario
  getChatService() {

    // seteo de las variables principales de otro usuario
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');

    // uid obtenida del usuario actual al loguearse
    this.uid = localStorage.getItem('userId');

    // obtencion de los chats mediante un mapeo con el factor del tiempo
    return this.angularFirestore.collection('chats').doc(this.uid).collection(this.ouid, ref => ref.orderBy('time')).snapshotChanges().pipe(map(chats => {

      // mapeo de datos
      return chats.map(a => {
        const data = a.payload.doc.data()
        data.id = a.payload.doc.id
        return data;
      })

    }))

  }


  



}
