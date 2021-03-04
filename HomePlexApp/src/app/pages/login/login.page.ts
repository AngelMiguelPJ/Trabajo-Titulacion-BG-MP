import { Component, OnInit } from '@angular/core';

// routeo
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// servicio de login
import { AuthService } from '../../services/auth/auth.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variables
  email: string;
  password: string;

  constructor(private authService: AuthService,
              private router: Router,
              private modalController: ModalController) {
                
               }

  ngOnInit() {
  }

  // funcion de login
  login(email, password) {

    // llamado al servicio de authenticacion para logearse
    this.authService.loginService(email, password).then(res => {
      //console.log("Respuesta: ", res)
      // redireccion a la pagina home si se logea correctamente
      this.router.navigate(["/tabs/tabhome"]);
    }).catch(err => {
      // mensaje de error en consola
      console.log("Error: ", err)
    })

  }

  async resetPasswordByEmail() {

    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: ResetPasswordComponent
    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss()
    });

  }

}
