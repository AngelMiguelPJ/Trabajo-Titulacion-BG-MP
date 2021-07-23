import { Injectable } from '@angular/core';
// importar librerias de angular para el autenticamiento
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { unescapeIdentifier } from '@angular/compiler';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

// bandera para verificar si esta autenticado o no
isAuthenticated = false;

// Contructor para iniciar los respectivos servicios
constructor(private angularFireAuth: AngularFireAuth, private router: Router,
  private angularFirestore: AngularFirestore,
  public location: Location,
  public toastController: ToastController) { }

// Metodo -Funcion -servicio de iniciar sesion mediante correo y contraseña
loginService(email: string, password: string) {
  // returno de la promesa con el llamado del servicion de inicio de sesion con email y contraseña


  // servicio de inicio de sesion
  return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(res => {

    // cambio del estado de la bander de si esta iniciada sesion
    this.isAuthenticated = true;
    // igual variable de uid del usuario que inicia sesion para guardarla localmente
    const userId = res.user.uid;
    localStorage.setItem('userId', userId);

  }).catch(err => {
    console.log('error=', err)
    this.isAuthenticated = false
    if (err.code == 'auth/user-not-found') {
      this.failedEmailToast();
    } else if (err.code == 'auth/wrong-password') {
      this.failedPasswordToast();
    }
    //alert('datos incorrectos o  no existe el usuario')
  })


}

async failedEmailToast() {
  const toast = await this.toastController.create({
    message: 'Correo electronico incorrecto, intento de nuevo.',
    duration: 1000,
    color: "danger"
  });
  toast.present();
}

async failedPasswordToast() {
  const toast = await this.toastController.create({
    message: 'contraseña incorrecta, intento de nuevo.',
    duration: 1000,
    color: "danger"
  });
  toast.present();
}

}
