import { Injectable } from '@angular/core';

// importar librerias de angular para el autenticamiento, ruteo y datos
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // bandera para verificar si esta autenticado o no
  isAuthenticated = false;

  // Contructor para iniciar los respectivos servicios
  constructor(private angularFireAuth: AngularFireAuth, private router: Router,
              private angularFirestore: AngularFirestore) {}

  // Metodo - Funcion de iniciar sesion mediante correo y contraseña
  loginService(email: string, password: string) {
    // returno de la promesa con el llamado del servicion de inicio de sesion con email y contraseña
    return new Promise((resolve, reject) => {

      // servicio de inicio de sesion
      this.angularFireAuth.signInWithEmailAndPassword(email, password).then(res => {

        // cambio del estado de la bander de si esta iniciada sesion
        this.isAuthenticated = true;
        // igual variable de uid del usuario que inicia sesion para guardarla localmente
        const userId = res.user.uid;
        localStorage.setItem('userId', userId);
        resolve(res)
      }).catch(err => {
        reject(err)
        this.isAuthenticated = false
        })

    })

  }

  // Metodo - Funcion cerrar sesion
  logoutService() {

    // llamado al servicio de cerrado de sesion de firebaseauth
    this.angularFireAuth.signOut().then(() => {

      // cambio del estado de si esta logeado o no
      this.isAuthenticated = false

      // redirreccion de rutas para cuando cierra sesion
      this.router.navigate(['/login']);

    })
    
  }

}