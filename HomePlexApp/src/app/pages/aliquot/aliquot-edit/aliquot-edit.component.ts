import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-aliquot-edit',
  templateUrl: './aliquot-edit.component.html',
  styleUrls: ['./aliquot-edit.component.scss'],
})
export class AliquotEditComponent implements OnInit {
  // arreglo de estado "Pagado o no"
  estadoCuotaList = [
    'Pagada',
    'Pendiente',
    'No pagada'
  ]

  // fecha actual
  fechaActual;
  fechaVencimiento;
  fechaSelect;

  //forms
  aliquotFormEdit: FormGroup;
  aliquotSeguimientoUpdate: FormGroup;
  IdAliquotUpdate;
  NameAliquotUser;
  idSeguimientoUpdate;
  totalSeguimientoUpdate = 0;
  totalSeguimiento = 0;
  ValorExtraAntiguo = 0;

  // coleccion de usuarios

  constructor(private navParams: NavParams,
    private aliquotService: AliquotService,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController,
    private aliquotSeguimientoService: AliquotSeguimientoService) { }

  ngOnInit() {
    // seteo de la fecha actual
    this.fechaActual = Date.now();

    this.IdAliquotUpdate = this.navParams.data.id;
    this.NameAliquotUser = this.navParams.data.DatosVecinoNombre;
    this.idSeguimientoUpdate = this.navParams.data.IdSeguimiento;
    this.ValorExtraAntiguo = this.navParams.data.ValorExtra;
    //console.log('a', this.IdAliquotUpdate);
    console.log('b',this.navParams.data)

    this.aliquotFormEdit = this.formBuilder.group({
      ValorCuota: this.navParams.data.ValorCuota,
      ValorExtra: this.navParams.data.ValorExtra,
      Fecha: this.navParams.data.Fecha,
      EstadoCuota: this.navParams.data.EstadoCuota,
      Descripcion: this.navParams.data.Descripcion
    })

    this.aliquotSeguimientoUpdate = this.formBuilder.group({
      Total: '',
    })

    this.aliquotSeguimientoService.getPaymentTrackingUnic(this.idSeguimientoUpdate).subscribe(resp => {
      //console.log(resp)

      this.totalSeguimientoUpdate = resp
      console.log(this.totalSeguimientoUpdate)
    })
    
    


  }

  updateAliquot() {

    // condicionamiento para que el id de la alicuota no se nulla ni indefinida
    if (this.IdAliquotUpdate !== null || this.IdAliquotUpdate !== undefined) {
      if (this.aliquotFormEdit.value.Descripcion != null
        && this.aliquotFormEdit.value.EstadoCuota != null
        && this.aliquotFormEdit.value.Fecha != null
        && this.aliquotFormEdit.value.ValorCuota != null) {
          if (this.aliquotFormEdit.value.ValorExtra > this.ValorExtraAntiguo) {
            //console.log('Mayor')
            this.aliquotSeguimientoUpdate.value.Total = (this.totalSeguimientoUpdate + (this.aliquotFormEdit.value.ValorExtra - this.ValorExtraAntiguo));
            this.aliquotSeguimientoService.updatePaymentTracking(this.idSeguimientoUpdate, this.aliquotSeguimientoUpdate.value).then(resp=>{
              //console.log(resp)
            })
          } else if (this.aliquotFormEdit.value.ValorExtra < this.ValorExtraAntiguo) {
            this.aliquotSeguimientoUpdate.value.Total = (this.totalSeguimientoUpdate - (this.ValorExtraAntiguo - this.aliquotFormEdit.value.ValorExtra));
            this.aliquotSeguimientoService.updatePaymentTracking(this.idSeguimientoUpdate, this.aliquotSeguimientoUpdate.value).then(resp=>{
              //console.log(resp)
            })
          } else {
            console.log('valor queda igual');  
          }

        // llamado al servicio de actualizacion de alicuotas
        this.aliquotService.updateAliquotServices(this.IdAliquotUpdate, this.aliquotFormEdit.value).then(() => {
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

  cancelar() {
    this.modalController.dismiss();
  }


  cambio(fechaEnviada) {
    this.fechaSelect = Date.parse(fechaEnviada)
    var mesDespues = 30 * 24 * 60 * 60 * 1000
    this.fechaVencimiento = this.fechaSelect + mesDespues;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'danger',

    });
    toast.present();
  }

  soloNumeros(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
