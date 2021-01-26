import { Injectable, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChildActivationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface users {
  id: string,
  name: string,
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // contructor
  userUid;
  constructor(private angularFirestore: AngularFirestore) { }


  // obtener usuarios
  getUsersService(){
    this.userUid = localStorage.getItem('userId')
    return this.angularFirestore.collection('users').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data = a.payload.doc.data() as users
          data.id = a.payload.doc.id;

          return data; 
      })
    })
    )
  }
}
