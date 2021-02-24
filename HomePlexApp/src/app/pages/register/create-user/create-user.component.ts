import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {

  typeUsers = [
    'Contador',
    'Administrador',
    'Vecino',
    'Arrendatario'
  ]

  usersFormCreate: FormGroup;

  constructor(private popover: PopoverController,
    private navParams: NavParams,
    public modalController: ModalController,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private usersService: UsersService,) { }

  ngOnInit() {

    this.usersFormCreate = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      TipoUsuario: ['', Validators.required],
      Casa: ['', Validators.required]
    });
    //console.log(this.usersFormCreate.value)
  }

  registerUser() {

    if (this.usersFormCreate.value.Name != '' && this.usersFormCreate.value.Email != ''
      && this.usersFormCreate.value.TipoUsuario != '' && this.usersFormCreate.value.Password != ''
      && this.usersFormCreate.value.Casa != '') {
      console.log(this.usersFormCreate.value)
      // llamado al servicio de registro de usuarios seteando dichas variables por medio del formulario
      this.usersService.registerUsersService(this.usersFormCreate.value.Email, 
        this.usersFormCreate.value.Password, this.usersFormCreate.value.Name, 
        this.usersFormCreate.value.TipoUsuario,
        this.usersFormCreate.value.Casa).then(() => {
        this.modalController.dismiss({
          'dismissed': true
        });
      }).catch(error => {
        // comprobacion de errores  y reseteo del formulario create en caso de error
        console.error(error)
      })
    } else {
      this.presentToast()
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
