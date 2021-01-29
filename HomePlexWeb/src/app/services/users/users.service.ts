import { Injectable, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChildActivationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UsersExport {
  id: string,
  Name: string,
  Email: string,
  TipoUsuario: string,
  Telefono: string,
  Casa: string
  Img: string

}



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // contructor
  userUid;
  isAdmin = false;
  constructor(private angularFirestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth,) { }


  // obtener usuarios
  getUsersService(){
    this.userUid = localStorage.getItem('userId')
    return this.angularFirestore.collection('users').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        //
        if (a.payload.doc.data()['Uid'] === this.userUid) {
          const b = a.payload.doc.data()['TipoUsuario']
          if(b == 'Administrador'){
            this.isAdmin = true
          }else{
            this.isAdmin = false
          }
        }
        //
        const data = a.payload.doc.data() as UsersExport
          data.id = a.payload.doc.id;
          return data; 
          
          
      })
    })
    )
  }

  // create users
  // registrar usuarios
  registerUsersService(email: string, password: string, name: string, tipoUsuario: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then(
          res => {
            console.log(res.user.uid)
            const uid = res.user.uid;
            this.angularFirestore.collection('users').doc(res.user.uid).set({
              Uid: uid,
              Email: email,
              Name: name,
              Img: '',
              Casa: '',
              Telefono: '',
              TipoUsuario: tipoUsuario

            })
            resolve(res)
          }
        ).catch(
          err =>
            reject(err)
        )
    })

  }

/**
   * Metodo para listar los usuarios
   */
  getUsersServices(){
    return this.angularFirestore.collection("users").snapshotChanges();
  }
  /**
   * actualiza un estudiante existente en firebase
   * @param id id de la coleccion en firebase
   * @param users a actualizar
   */
  updateUsersServices(id:any, users:any){
    return this.angularFirestore.collection("users").doc(id).update(users);

  }
  /**
   * borrar un estudiante existente en firebase
   * @param id id de la coleccion en firebase
   */
  deleteUsersServices(id:any){
    return this.angularFirestore.collection("users").doc(id).delete();
    
  }


  



}
