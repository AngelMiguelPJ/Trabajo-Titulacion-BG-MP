import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
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
    'Vecino',
    'Arrendatario'
  ]

  usersFormEdit: FormGroup;
  nameUser;
  userUid;

  constructor(public formBuilder: FormBuilder,
    private navParams: NavParams,
    private usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController) { }

  ngOnInit() {

   // console.log('a', this.navParams.data)
    this.nameUser = this.navParams.data.Name
    this.userUid = this.navParams.data.idFirebase

    this.usersFormEdit = this.formBuilder.group({
      TipoUsuario: this.navParams.data.TipoUsuario
    });

    //console.log('b', this.usersFormEdit.value)
  }

  updateUser() {
    //console.log('c', this.usersFormEdit.value)
    // condicionamiento para que el id de la alicuota no se nulla ni indefinida
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
