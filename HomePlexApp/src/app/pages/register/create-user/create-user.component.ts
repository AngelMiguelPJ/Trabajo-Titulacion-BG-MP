import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';

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


  userDataCreate: any = {};
  constructor(private popover: PopoverController,
    private navParams: NavParams,
    public modalController: ModalController,
    public toastController: ToastController) { }

  ngOnInit() {
    console.log(this.navParams.data)
    this.userDataCreate = this.navParams.data
    console.log(this.userDataCreate)
  }

  guardar(){
    
    if (this.userDataCreate.Name != '' && this.userDataCreate.Email != '' 
        && this.userDataCreate.TipoUsuario != '' && this.userDataCreate.Password != '') {
      this.modalController.dismiss(this.userDataCreate)
    }else{
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
