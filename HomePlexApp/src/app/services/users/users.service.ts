import { Injectable } from '@angular/core';

// servicios de firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

// importacion complementaria para mapeo de datos
import { map } from 'rxjs/operators';


// modelo para exportacion
export interface UsersExport {
  id: string;
  Name: string;
  Email: string;
  TipoUsuario: string;
  Telefono: string;
  Password: string;
  Casa: string;
  Img: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  // Variable userUid del usuario actual
  userUid;

  // variable bandera para establecer si es admin, contador o no
  isAdmin = false;
  isAccountant = false;
  isNeighbour = false;
  isAdminMain = false;
  uidAdmin;

  // contructor para iniciar los servicios
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth)
     { }

  // Metodo -funcion -servicio para obtener usuarios mediante el mapeo y asi usar variable por variable
  getUsersService() {

    // userUid del usuario actual obtenido en el inicio de sesion
    this.userUid = localStorage.getItem('userId');

    // respectivo servicio de firestore para la obtencion de los usuarios
    return this.angularFirestore.collection('users').snapshotChanges().pipe(map(users => {

      // return del mapeo de los usuarios
      return users.map(res => {

        //Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const adminVar = res.payload.doc.data()['TipoUsuario']
          if (adminVar == 'Administrador') {
            this.isAdmin = true;
            this.uidAdmin = localStorage.setItem('uidAdmin', res.payload.doc.data()['Uid']);
          } else {
            this.isAdmin = false;
            this.uidAdmin = '';
          }
        }

        //Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const accountVar = res.payload.doc.data()['TipoUsuario']
          if (accountVar == 'Contador') {
            this.isAccountant = true
          } else {
            this.isAccountant = false
          }
        }

        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const accountVar = res.payload.doc.data()['TipoUsuario']
          if (accountVar == 'Vecino') {
            this.isNeighbour = true
          } else {
            this.isNeighbour = false
          }
        }

        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const accountVar = res.payload.doc.data()['TipoUsuario']
          if (accountVar == 'Administrador Principal') {
            this.isAdminMain = true
          } else {
            this.isAdminMain = false
          }
        }

          // seteo de los datos en el modelo UsersExport para su exportacion
        const data = res.payload.doc.data() as UsersExport
        data.id = res.payload.doc.id;
        return data;

      });

    }));

  }



  // Metodo -funcion -servicio para el registro de usuarios mediante correo y contraseña, ademas de los demas datos en firestore
  registerUsersService(email: string, password: string, name: string, tipoUsuario: string, casa: string) {
    return new Promise((resolve, reject) => {

      // respectivo servicio de creacion de usuarios de firestore
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then(
          res => {

            // console.log(res.user.uid)
            // uid del usuario creado
            const uid = res.user.uid;

            // creacion del usuario en firestore a partir de su uid de usuario creado por medio de correo y contraseña
            this.angularFirestore.collection('users').doc(res.user.uid).set({
              // datos relevantes en firestore de los usuarios
              Uid: uid,
              Email: email,
              Name: name,
              Img: 'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de-ilustr.jpg?ver=6',
              Casa: casa,
              Telefono: '',
              TipoUsuario: tipoUsuario,
              token: ''
            });
            resolve(res);
          }
        ).catch(
          err =>
            reject(err)
        );

    });

  }

  getId(){
    return this.userUid = localStorage.getItem('userId');
  }

  getOnlyThisUser(){

    // userUid del usuario actual obtenido en el inicio de sesion
    this.userUid = localStorage.getItem('userId');
    return this.angularFirestore.collection('users', ref => ref.where('Uid', '==', this.userUid)).snapshotChanges().pipe(map(res => {
      // console.log(res)

      return res.map(a => {

        // Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (a.payload.doc.data()['Uid'] === this.userUid) {
          const adminVar = a.payload.doc.data()['TipoUsuario'];
          if (adminVar == 'Administrador') {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        }

        // Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (a.payload.doc.data()['Uid'] === this.userUid) {
          const accountVar = a.payload.doc.data()['TipoUsuario'];
          if (accountVar == 'Contador') {
            this.isAccountant = true;
          } else {
            this.isAccountant = false;
          }
        }
        const data = a.payload.doc.data();
        return data;
      });

    }));
  }

  getAllUsers(){

    // userUid del usuario actual obtenido en el inicio de sesion
    this.userUid = localStorage.getItem('userId');

    return this.angularFirestore.collection('users').snapshotChanges().pipe(map(res => {
      // console.log(res)

      return res.map(a => {
        const data = a.payload.doc.data();
        return data;
      });

    }));
  }

  getAllUsersWithoutThisUser(){

    // userUid del usuario actual obtenido en el inicio de sesion
    this.userUid = localStorage.getItem('userId');

    return this.angularFirestore.collection('users', ref => ref.where('Uid', '!=', this.userUid)).snapshotChanges().pipe(map(res => {
      // console.log(res)

      return res.map(a => {
        const data = a.payload.doc.data();
        return data;
      });

    }));
  }

  // Metodo -funcion -servicio para la optencion de usuarios mediante snapshotchanges
  // para luego por setear estos datos en un arreglo
  getUsersServices() {
    return this.angularFirestore.collection('users').snapshotChanges();
  }

  getDataForId(id: string){
    return this.angularFirestore.collection('users').doc(id).valueChanges();

  }

  // Metodo -funcion -servicio de actualizacion de datos de un usuario por id y el campo a actualizar
  updateUsersServices(id: any, users: any) {
    return this.angularFirestore.collection('users').doc(id).update(users);

  }

  updateToken(id: any, token: any) {
    return this.angularFirestore.collection('users').doc(id).update(token);

  }

  getTokens(){
    
  }

  // Metodo -funcion -servicio de actualizacion de foto de perfil de un usuario por id y el campo a actualizar
  updateUsersServicesImg(id: any, users: any) {
    return this.angularFirestore.collection('users').doc(id).update(users);

  }

  // Metodo -funcion -servicio de borrarado de datos de un usuario por id
  deleteUsersServices(id: any) {
    return this.angularFirestore.collection('users').doc(id).delete();
  }

}
