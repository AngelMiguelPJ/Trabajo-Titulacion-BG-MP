import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import { UsersService } from 'src/app/services/users/users.service';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  userProfileFormEdit: FormGroup;

  uidUser;

  constructor(private modalController: ModalController,
    private popover: PopoverController,
    public alertCtrl: AlertController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    private usersService: UsersService,
    public toastController: ToastController) { }

  ngOnInit() {

    this.userProfileFormEdit = this.formBuilder.group({
      Name: this.navParams.data[0].Name,
      Telefono: this.navParams.data[0].Telefono
    })
    
    //console.log(this.navParams.data[0].Uid)
    this.uidUser = this.navParams.data[0].Uid

  }

  async message(message:string) {
    const alert = await this.alertCtrl.create({
      header : 'Cambio contraseña',
      message: message,
      buttons: ['OK']
    })
    await alert.present();
  }

  async changePassword(){
    const alert = await this.alertCtrl.create({
      header : 'Cambiar de contraseña',
      subHeader : 'Por motivos de seguridad ingresa tu contraseña actual',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Escribe tu antigua contraseña...',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'Nueva Contraseña..',
          type: 'password'
        },
        {
          name: 'newPasswordConfirm',
          placeholder: 'Confirna tu nueva contraseña..',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
         {
          text: 'Guardar',
          handler: data => {
                
            //First you get the current logged in user
            const cpUser = firebase.auth().currentUser; 

            /*Then you set credentials to be the current logged in user's email
            and the password the user typed in the input named "old password"
            where he is basically confirming his password just like facebook for example.*/
            const credentials = firebase.auth.EmailAuthProvider.credential(
              cpUser.email, data.oldPassword);

              //Reauthenticating here with the data above
              cpUser.reauthenticateWithCredential(credentials).then(
                success => {
                  if (data.Name !== null && data.Name !== "" ) {
                    cpUser.updateProfile({
                      displayName: data.Name
                    })
                    .then((data) => {
                      console.log(data);
                      //this.presentToast();
                    })
                    .catch(err => {
                      console.log(` failed ${err}`);
                    });
                    console.log('Funciona');
                  }
                  if(data.newPassword != data.newPasswordConfirm){
                    this.message('No cinciden las contraseñas');

                  } else if(data.newPassword.length < 6){
                    this.message('Debe contener al menos 6 caracteres');

                  } else {
                    
                    this.message('Tu contraseña se actualizo correctamente');
                    
                  /* Update the password to the password the user typed into the
                    new password input field */
                  cpUser.updatePassword(data.newPassword).then(function(){
                    //Success
                  }).catch(function(error){
                    //Failed
                  });
                  }
                },
                error => {
                  console.log(error);
                  if(error.code === "auth/wrong-password"){
                    this.message('La contraseña antigua no es correcta');

                  }
                }
              )
              console.log(credentials); 
            }
          }
      ]
    })
    await alert.present();
  }
  
  async updateUser() {
    console.log(this.userProfileFormEdit.value)
    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (this.uidUser !== null || this.uidUser !== undefined) {
      if (this.userProfileFormEdit.value.Name != '' && this.userProfileFormEdit.value.Telefono != '') {
        // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
        this.usersService.updateUsersServices(this.uidUser, this.userProfileFormEdit.value).then(() => {

          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.modalController.dismiss({
            'dismissed': true
          });

        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
        });
      } else {
        this.presentToast();
      }
    }



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
