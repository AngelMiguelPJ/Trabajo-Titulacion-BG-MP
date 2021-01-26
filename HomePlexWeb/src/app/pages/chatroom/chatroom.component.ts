import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  name;
  ouid;
  uid;
  chats = [];
  nameCurrUser;

  constructor(private angularFirestore: AngularFirestore,) {

    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.uid = localStorage.getItem('userId');

  }

  ngOnInit(): void {
    this.angularFirestore.collection('chats').doc(this.uid).collection(this.ouid, ref => ref.orderBy('time')).snapshotChanges().subscribe(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.payload.doc.data())
        console.log(this.chats)
      })
    })
  }

  send(textMsg: string) {


    this.angularFirestore.collection("chats").doc(this.uid).collection(this.ouid).add({
      time: Date.now(),
      uid: this.uid,
      msg: textMsg
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
