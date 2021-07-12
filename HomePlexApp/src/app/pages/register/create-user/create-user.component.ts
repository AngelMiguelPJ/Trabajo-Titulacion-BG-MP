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
  ];

  usersFormCreate: FormGroup;

  // variables de validacion
  public emailValido: boolean;
  public telefonoValido: boolean;


  constructor(private popover: PopoverController,
              private navParams: NavParams,
              public modalController: ModalController,
              public toastController: ToastController,
              public formBuilder: FormBuilder,
              private usersService: UsersService, ) { }

  ngOnInit() {

    this.usersFormCreate = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      TipoUsuario: ['', Validators.required],
      Casa: ['', Validators.required]
    });
    // console.log(this.usersFormCreate.value)
  }

  registerUser() {

    if (this.usersFormCreate.value.Name != '' && this.usersFormCreate.value.Email != ''
      && this.usersFormCreate.value.TipoUsuario != '' && this.usersFormCreate.value.Password != ''
      && this.usersFormCreate.value.Casa != '' && this.emailValido == true) {
      console.log(this.usersFormCreate.value);
      // llamado al servicio de registro de usuarios seteando dichas variables por medio del formulario
      this.usersService.registerUsersService(this.usersFormCreate.value.Email,
        this.usersFormCreate.value.Password, this.usersFormCreate.value.Name,
        this.usersFormCreate.value.TipoUsuario,
        this.usersFormCreate.value.Casa).then(() => {
          this.modalController.dismiss({
            dismissed: true
          });
        }).catch(error => {
          // comprobacion de errores  y reseteo del formulario create en caso de error
          console.error(error);
        });
    } else {
      this.presentToast();
    }

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos o su correo electronico es erroneo</b>',
      duration: 1000,
      color: 'danger',

    });
    toast.present();
  }

  cancelar() {
    this.modalController.dismiss();
  }



  // validacion de campos

  // funcion de validacion de email
  validarEmail(email: string) {

    // algoritmo de comprobacion de email
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (email.length >= 1) {
      this.emailValido = regexp.test(email);

      // console.log('Email es:', this.emailValido)
    } else if (email.length == 0){
      this.emailValido = null;
    }


  }



  sololetras(event: any) {
    let regex = new RegExp('^[a-zA-Z ]+$');
    let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

}
