import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-aliquot-create',
  templateUrl: './aliquot-create.component.html',
  styleUrls: ['./aliquot-create.component.scss'],
})
export class AliquotCreateComponent implements OnInit {

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
  aliquotFormCreate: FormGroup;


  // coleccion de usuarios
  collectionUsers = { count: 0, data: [] }

  constructor(private aliquotService: AliquotService,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController) { }


  ngOnInit() {

    // seteo de la fecha actual
    this.fechaActual = Date.now();

    //iniciar formulario para la creacion de alicuotas
    this.aliquotFormCreate = this.formBuilder.group({
      IdAliquot: '',
      DatosVecino: '',
      ValorCuota: '',
      ValorExtra: '',
      Fecha: '',
      FechaVencimiento: '',
      EstadoCuota: '',
      Descripcion: ''
    })
    //console.log('a', this.aliquotFormCreate.value)


    //console.log('b', this.aliquotDataCreate)

    //cargando todos los usuarios de firebase-firestore
    this.usersService.getUsersServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionUsers.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          Nombre: e.payload.doc.data().Name,
          uidUser: e.payload.doc.id
        }
      })
      //console.log(this.collectionUsers.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }


  createAliquot() {
    const idAliquotRandom = Math.random().toString(36).substring(2);
    this.aliquotFormCreate.value.IdAliquot = idAliquotRandom;
    if (this.aliquotFormCreate.value.DatosVecino != ''
      && this.aliquotFormCreate.value.Descripcion != ''
      && this.aliquotFormCreate.value.EstadoCuota != ''
      && this.aliquotFormCreate.value.Fecha != ''
      && this.aliquotFormCreate.value.FechaVencimiento != ''
      && this.aliquotFormCreate.value.ValorCuota != ''
      && this.aliquotFormCreate.value.ValorExtra != '') {
      console.log(this.aliquotFormCreate.value)
      this.aliquotService.createAliquotServices(this.aliquotFormCreate.value).then(resp => {

        // llaamado al servicio de creacion de copia de seguridad de alicuotas
        this.aliquotService.createAliquotBackupServices(this.aliquotFormCreate.value).then(() => {
          this.modalController.dismiss({
            'dismissed': true
          });
        })


      }).catch(error => {
        console.error(error)
      })

    } else {
      console.log('no recibe nada');
      this.presentToast();
    }


  }

  // Funcion - metodo para setear la fecha de vencimiento 1 mes despues o mas 
  // de acuerdo a la fecha designada primera
  cambio(fechaEnviada) {

    this.fechaSelect = Date.parse(fechaEnviada)
    var mesDespues = 30 * 24 * 60 * 60 * 1000
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

}
