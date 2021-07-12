import { Component, OnInit } from '@angular/core';

// routeo
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// servicio de login
import { AuthService } from '../../services/auth/auth.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variables
  email: string;
  password: string;

  // variable de recarga
  recargaPagina;

  constructor(private authService: AuthService,
              private router: Router,
              private modalController: ModalController,
              public location: Location) {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };

      this.recargaPagina = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
        }
      });
    }

  ngOnInit() {
  }

  // funcion de login
  async login(email, password) {

    // llamado al servicio de authenticacion para logearse
    await this.authService.loginService(email, password).then(res => {
      // console.log("Respuesta: ", res)
      // redireccion a la pagina home si se logea correctamente

    }).catch(err => {
      // mensaje de error en consola
      console.log('Error: ', err);
    }).then(() => {
      this.router.navigateByUrl('/home');
    });

  }

  async resetPasswordByEmail() {

    // console.log(this.usersFormEdit.value)
    await this.modalController.create({
      component: ResetPasswordComponent
    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  ngOnDestroy(){
    if (this.recargaPagina) {
      this.recargaPagina.unsubscribe();
    }
  }

}
