import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  // variables
  public emailValido: boolean;
  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router) { }

  ngOnInit(): void {
    this.emailValido = false;
  }

  enviar(email: string){
    //console.log(email)
    if (email != '' && this.emailValido == true) {
      this.angularFireAuth.sendPasswordResetEmail(email).then(()=>{
        this.router.navigate(["/login"]);
      }).catch(err=>{
        console.log(err)
      })
    }


  }

    // funcion de validacion de email
    validarEmail(email: string) {
      //console.log(email)
      // algoritmo de comprobacion de email
      const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (email.length >= 1) {
        this.emailValido = regexp.test(email)
  
        //console.log('Email es:', this.emailValido)
      } else if(email.length == 0){
        this.emailValido = null
      }
  
  
    }

}
