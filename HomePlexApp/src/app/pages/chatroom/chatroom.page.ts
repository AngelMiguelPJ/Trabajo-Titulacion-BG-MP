import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  // datos
  name;
  ouid;
  uid;
  chats = [];
  textMsg;
  nameCurrUser;

  constructor(private angularFirestore: AngularFirestore,
    private router: Router) {
    this.name = sessionStorage.getItem("name");
    this.ouid = sessionStorage.getItem('uid');

    this.uid = localStorage.getItem('userId');
    this.nameCurrUser = localStorage.getItem('userCurrentName')

    angularFirestore.collection("chats").doc(this.uid).collection(this.ouid, ref => ref.orderBy('time')).snapshotChanges().subscribe(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.payload.doc.data())
        console.log(this.chats)
      });

    })
  }

  ngOnInit() {
  }

  send() {


    this.angularFirestore.collection("chats").doc(this.uid).collection(this.ouid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg,
      Name: this.nameCurrUser
    })

    this.angularFirestore.collection("chats").doc(this.ouid).collection(this.uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg,
      Name: this.nameCurrUser
    }).then(() => {
      this.textMsg = "";
    })

  }

  chatTabPage() {
    this.router.navigate(['/tabs/tabchat'])
  }

}
