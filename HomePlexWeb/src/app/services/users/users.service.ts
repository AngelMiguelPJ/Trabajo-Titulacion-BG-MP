import { Injectable, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChildActivationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// modelo para exportacion
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

  // Varibel userUid del usuario actual
  userUid;

  // variable bandera para establecer si es admin o no
  isAdmin = false;
  isAccountant = false;

  // contructor para iniciar los servicios
  constructor(private angularFirestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth,) { }


  // Servicio para obtener usuarios mediante el mapeo y asi usar variable por variable
  getUsersService(){

    //userUid del usuario actual obtenido en el inicio de sesion
    this.userUid = localStorage.getItem('userId')

    // respectivo servicio de firestore para la obtencion de los usuarios
    return this.angularFirestore.collection('users').snapshotChanges().pipe(map(users =>{

      // return del mapeo de los usuarios
      return users.map(res =>{
        
        //Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const adminVar = res.payload.doc.data()['TipoUsuario']
          if(adminVar == 'Administrador'){
            this.isAdmin = true
          }else{
            this.isAdmin = false
          }
        }

        //Condicional para verificar el tipo de usuario es cambiar el estado de bandera de acuerdo al usuario actual
        if (res.payload.doc.data()['Uid'] === this.userUid) {
          const accountVar = res.payload.doc.data()['TipoUsuario']
          if(accountVar == 'Contador'){
            this.isAccountant = true
          }else{
            this.isAccountant = false
          }
        }
        
        // seteo de los datos en el modelo UsersExport para su exportacion
        const data = res.payload.doc.data() as UsersExport
        data.id = res.payload.doc.id;
        return data;    

      })

    }))

  }


  // registrar usuarios mediante correo y contraseña, ademas de los demas datos en firestore
  registerUsersService(email: string, password: string, name: string, tipoUsuario: string) {
    return new Promise((resolve, reject) => {

      // respectivo servicio de creacion de usuarios de firestore
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then(
          res => {
            //console.log(res.user.uid)
            // uid del usuario creado
            const uid = res.user.uid;

            // creacion del usuario en firestore a partir de su uid de usuario creado por medio de correo y contraseña
            this.angularFirestore.collection('users').doc(res.user.uid).set({
              // datos relevantes en firestore de los usuarios
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

  // Motodo-funcion-servicio para la optencion de usuarios mediante snapshotchanges
  // para luego por setear estos datos en un arreglo
  getUsersServices(){
    return this.angularFirestore.collection("users").snapshotChanges();
  }
  
  // Metodo-funcion-servicio de actualizacion de datos de un usuario por id y el campo a actualizar
  updateUsersServices(id:any, users:any){
    return this.angularFirestore.collection("users").doc(id).update(users);

  }

  // Metodo-funcion-servicio de actualizacion de foto de perfil de un usuario por id y el campo a actualizar
  updateUsersServicesImg(id:any, users:any){
    return this.angularFirestore.collection("users").doc(id).update(users);

  }
  
  // Metodo-funcion-servicio de borrarado de datos de un usuario por id
  deleteUsersServices(id:any){
    return this.angularFirestore.collection("users").doc(id).delete();
  }

}
