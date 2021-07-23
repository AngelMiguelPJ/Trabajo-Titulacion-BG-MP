import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-aliquot-seguimiento-edit',
  templateUrl: './aliquot-seguimiento-edit.component.html',
  styleUrls: ['./aliquot-seguimiento-edit.component.scss'],
})
export class AliquotSeguimientoEditComponent implements OnInit {
//variables
aliquotSeguimientoFormEdit: FormGroup;
uidAdmin;
idSeguimiento;
estadoCuotaList = [
  'Pagados',
  'Pendientes'
]
text;

constructor(private navParams: NavParams,
  private aliquotSeguimientoService: AliquotSeguimientoService,
  public formBuilder: FormBuilder,
  public usersService: UsersService,
  public modalController: ModalController,
  public toastController: ToastController) { }

ngOnInit() {

  console.log('datos',this.navParams.data)
  this.text = this.navParams.data.Mes + ' - ' + this.navParams.data.Anio
  this.idSeguimiento = this.navParams.data.id;
  this.aliquotSeguimientoFormEdit = this.formBuilder.group({
    Estado: this.navParams.data.Estado,
    Descripcion: this.navParams.data.Descripcion,
  })
}

//funciones
cancelar() {
  this.modalController.dismiss();
}

updateSeguimiento() {
  if (this.aliquotSeguimientoFormEdit.value.Estado != '' && this.aliquotSeguimientoFormEdit.value.Descripcion != '') {
    this.aliquotSeguimientoService.updatePaymentTracking(this.idSeguimiento, this.aliquotSeguimientoFormEdit.value).then(resp => {
      this.modalController.dismiss({
        'dismissed': true
      });
    })
  }else{
    this.presentToast();
  }

}

async presentToast() {
  const toast = await this.toastController.create({
    message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
    duration: 1000,
    color: 'danger',

  });
  toast.present();
}


}
