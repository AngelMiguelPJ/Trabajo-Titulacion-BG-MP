import { Injectable } from '@angular/core';

// importar librerias de angular para el autenticamiento
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  isAuthenticated = false;
  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private angularFirestore: AngularFirestore) { }

  // iniciar sesion mediante correo
  loginService(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.signInWithEmailAndPassword(email, password).then(res => {
        this.isAuthenticated = true
        resolve(res)
      }).catch(err => {
        reject(err)
        this.isAuthenticated = false
      })
    })
  }

  // cerrar sesion
  logoutService() {
    this.angularFireAuth.signOut().then(() => {
      this.isAuthenticated = false
      this.router.navigate(['/login']);
    })
  }

  // registrar usuarios
  registerService(email: string, password: string, name: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then(
          res => {
            console.log(res.user.uid)
            const uid = res.user.uid;
            this.angularFirestore.collection('users').doc(res.user.uid).set({
              Uid: uid,
              Name: name,
              Email: email,
              Img: '',
              Casa: '',
              Telefono: '',
              TipoUsuario: ''

            })
            resolve(res)
          }
        ).catch(
          err =>
            reject(err)
        )
    })

  }
}
