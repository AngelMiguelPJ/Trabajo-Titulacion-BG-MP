import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  typeUsers = [
    'Contador',
    'Administrador',
    'Vecino'
  ]

  usersFormEdit: FormGroup;
  usersFormEditAdmin: FormGroup;
  nameUser;
  userUid;
  uidAdminFirebase;

  constructor(public formBuilder: FormBuilder,
    private navParams: NavParams,
    private usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController,
    public authService: AuthService,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private userService: UsersService) { }

  ngOnInit() {

   // console.log('a', this.navParams.data)
    this.nameUser = this.navParams.data.Name
    this.userUid = this.navParams.data.idFirebase
    console.log(localStorage.getItem('userId'));
    this.uidAdminFirebase = localStorage.getItem('userId');
    this.usersFormEdit = this.formBuilder.group({
      TipoUsuario: this.navParams.data.TipoUsuario
    });
    this.usersFormEditAdmin = this.formBuilder.group({
      TipoUsuario: ['', Validators.required],
    });

    //console.log('b', this.usersFormEdit.value)
  }

  updateUser() {
    //console.log('c', this.usersFormEdit.value)
    if (this.usersFormEdit.value.TipoUsuario == 'Administrador' && this.userUid != this.uidAdminFirebase) {
      this.usersFormEditAdmin.value.TipoUsuario = 'Vecino';
      if (this.userUid !== null || this.userUid !== undefined) {
        if (this.usersFormEdit.value.TipoUsuario != '') {
  
          // llamado al servicio de actualizacion de alicuotas
          this.usersService.updateUsersServices(this.userUid, this.usersFormEdit.value).then(() => {
            
          }).catch(error => {
            console.error(error);
          });
          this.usersService.updateUsersServices(this.uidAdminFirebase, this.usersFormEditAdmin.value).then(() => {
            this.modalController.dismiss({
              'dismissed': true
            });
            this.angularFireAuth.signOut().then(() => {

              // cambio del estado de si esta logeado o no
              //this.isAuthenticated = false;
              localStorage.removeItem('userId');
              localStorage.clear();
              // redirreccion de rutas para cuando cierra sesion
              //this.router.navigate(['/tabs/tabhome'])
  
            }).then(() => {
              this.router.navigateByUrl('/login')
            })
          }).catch(error => {
            console.error(error);
          });
  
        } else {
          this.presentToast();
        }
      }
    } else {
      if (this.userUid !== null || this.userUid !== undefined) {
        if (this.usersFormEdit.value.TipoUsuario != '') {
  
          // llamado al servicio de actualizacion de alicuotas
          this.usersService.updateUsersServices(this.userUid, this.usersFormEdit.value).then(() => {
            this.modalController.dismiss({
              'dismissed': true
            });
          }).catch(error => {
            console.error(error);
          });
  
        } else {
          this.presentToast();
        }
      }
    }
    // condicionamiento para que el id de la alicuota no se nulla ni indefinida

  }

  cancelar(){
    this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'primary',
    });
    toast.present();
  }

}
