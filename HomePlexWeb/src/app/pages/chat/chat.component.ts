import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    private angularFirestore: AngularFirestore, private route: Router) {
    this.name = sessionStorage.getItem("nameContact");
    this.ouid = sessionStorage.getItem('uidContact');
    this.uid = localStorage.getItem('userId');

  }

  ngOnInit(): void {
    this.userUid = localStorage.getItem('userId')
    this.usersService.getUsersService().subscribe(users => {
      this.usersList = users;
    })
    this.angularFirestore.collection('chats').doc(this.uid).collection(this.ouid, ref => ref.orderBy('time')).snapshotChanges().subscribe(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.payload.doc.data())
        console.log(this.chats)
      })
    })

  }

  gotoChatRoom(uid, name) {
    console.log(uid)
    console.log(name)
    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)
    this.route.navigateByUrl('/home', { skipLocationChange: true }).then(() =>
      this.route.navigate(["/chat"]));
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
