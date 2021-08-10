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
  'Pagada',
  'Pendiente'
]
text;
idSeguimientoUpdate;
idAliquotSeguimiento;
idAliquotSeguimientoLenght;
aliquotFormUpdate: FormGroup;

constructor(private navParams: NavParams,
  private aliquotSeguimientoService: AliquotSeguimientoService,
  public formBuilder: FormBuilder,
  public usersService: UsersService,
  public modalController: ModalController,
  public toastController: ToastController) { }

ngOnInit() {

  console.log('datos',this.navParams.data)
  this.text = this.navParams.data.Mes + ' - ' + this.navParams.data.Anio
  this.idSeguimientoUpdate = this.navParams.data.id;
  this.aliquotSeguimientoFormEdit = this.formBuilder.group({
    Estado: this.navParams.data.Estado,
    Descripcion: this.navParams.data.Descripcion,
  })
  this.aliquotSeguimientoService.getAliquotOnlyThisPaymentTracking(this.idSeguimientoUpdate).subscribe(resp => {
    //console.log(resp);
    this.idAliquotSeguimiento = resp;
    this.idAliquotSeguimientoLenght = resp.length;

  })
  this.aliquotFormUpdate = this.formBuilder.group({
    EstadoCuota: '',
    DescripcionMensual: ''
  })
}

//funciones
cancelar() {
  this.modalController.dismiss();
}

updateSeguimiento() {
  if (this.aliquotSeguimientoFormEdit.value.Estado != '' && this.aliquotSeguimientoFormEdit.value.Descripcion != '') {
    console.log(this.aliquotSeguimientoFormEdit.value.Estado)
    this.aliquotFormUpdate.value.EstadoCuota = this.aliquotSeguimientoFormEdit.value.Estado;
      this.aliquotFormUpdate.value.DescripcionMensual = this.aliquotSeguimientoFormEdit.value.Descripcion;
      this.aliquotSeguimientoService.updatePaymentTracking(this.idSeguimientoUpdate, this.aliquotSeguimientoFormEdit.value).then(resp => {
        
        this.modalController.dismiss({
          'dismissed': true
        });
      })
      for (let index = 0; index < this.idAliquotSeguimientoLenght; index++) {
        const element = this.idAliquotSeguimiento[index];
        //console.log(element)
        //console.log(this.aliquotFormUpdate.value.EstadoCuota)
        this.aliquotSeguimientoService.updateAliquotServicesPayment(element, this.aliquotFormUpdate.value)
      }


    
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
