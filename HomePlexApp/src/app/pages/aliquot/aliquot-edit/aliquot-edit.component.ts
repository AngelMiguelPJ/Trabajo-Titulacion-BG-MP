import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
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
  ];

  // fecha actual
  fechaActual;
  fechaVencimiento;
  fechaSelect;

  // forms
  aliquotFormEdit: FormGroup;
  IdAliquotUpdate;
  NameAliquotUser;

  // coleccion de usuarios

  constructor(private navParams: NavParams,
              private aliquotService: AliquotService,
              public formBuilder: FormBuilder,
              public usersService: UsersService,
              public modalController: ModalController,
              public toastController: ToastController) { }

  ngOnInit() {
    // seteo de la fecha actual
    this.fechaActual = Date.now();

    this.IdAliquotUpdate = this.navParams.data.id;
    this.NameAliquotUser = this.navParams.data.DatosVecinoNombre;
    // console.log('a', this.IdAliquotUpdate);
    // console.log('b',this.navParams.data)

    this.aliquotFormEdit = this.formBuilder.group({
      ValorCuota: this.navParams.data.ValorCuota,
      ValorExtra: this.navParams.data.ValorExtra,
      Fecha: this.navParams.data.Fecha,
      FechaVencimiento: this.navParams.data.FechaVencimiento,
      EstadoCuota: this.navParams.data.EstadoCuota,
      Descripcion: this.navParams.data.Descripcion
    });

    // console.log('c',this.aliquotFormEdit.value)


  }

  updateAliquot() {

    // condicionamiento para que el id de la alicuota no se nulla ni indefinida
    if (this.IdAliquotUpdate !== null || this.IdAliquotUpdate !== undefined) {
      if (this.aliquotFormEdit.value.Descripcion != null
        && this.aliquotFormEdit.value.EstadoCuota != null
        && this.aliquotFormEdit.value.Fecha != null
        && this.aliquotFormEdit.value.FechaVencimiento != null
        && this.aliquotFormEdit.value.ValorCuota != null) {

        // llamado al servicio de actualizacion de alicuotas
        this.aliquotService.updateAliquotServices(this.IdAliquotUpdate, this.aliquotFormEdit.value).then(() => {
          this.modalController.dismiss({
            dismissed: true
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
    this.fechaSelect = Date.parse(fechaEnviada);
    const mesDespues = 30 * 24 * 60 * 60 * 1000;
    this.fechaVencimiento = this.fechaSelect + mesDespues;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'primary',

    });
    toast.present();
  }

  soloNumeros(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
