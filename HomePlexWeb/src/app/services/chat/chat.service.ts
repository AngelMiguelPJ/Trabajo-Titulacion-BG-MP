import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //
  name;
  ouid;
  uid;
  constructor(private angularFirestore: AngularFirestore) { 
    
  }

  getChatService(){
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.uid = localStorage.getItem('userId');

    return this.angularFirestore.collection('chats').doc(this.uid).collection(this.ouid, ref => ref.orderBy('time')).snapshotChanges().pipe(map(chats =>{
      return chats.map(a =>{
        const data = a.payload.doc.data()
        data.id = a.payload.doc.id
        return data;
      })
    }))
  }
}
