import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-aliquot-seguimiento-create',
  templateUrl: './aliquot-seguimiento-create.component.html',
  styleUrls: ['./aliquot-seguimiento-create.component.scss'],
})
export class AliquotSeguimientoCreateComponent implements OnInit {

  //variables
  uidAdmin;
  estadoCuotaList = [
    'Pagada',
    'Pendiente'
  ]
  numUser;
  collectionUsers = { count: 0, data: [] }
  collectionAliquotSeguimiento = { count: 0, data: [] };
  collectionAliquotSeguimientoLength;
  fechasFilter;
  fechas = [];
  fechaRepetida: boolean;
  seguimiento: boolean;
  seguimientoId;
  idSeguimientoUpdate;
  aliquotFormCreate: FormGroup;
  aliquotSeguimientoFormCreate: FormGroup;
  fechaFinal;
  //

  constructor(public formBuilder: FormBuilder,
    public usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController,
    private aliquotSeguimientoService: AliquotSeguimientoService,
    private aliquotService: AliquotService) { }

  ngOnInit() {
    // SEGUIMIENTO
    this.uidAdmin = localStorage.getItem('userId');
    this.aliquotSeguimientoFormCreate = this.formBuilder.group({
      IdUser: this.uidAdmin,
      Descripcion: '',
      Fecha: '',
      Mes: '',
      Anio: '',
      ValorCuota: '',
      Total: '',
      Estado: ''

    })

    // NUMEOR DE USUARIOS
    this.usersService.getUsersServices().subscribe(resp => {
      //console.log(resp.length);
      this.numUser = resp.length;
    })

    //  ALICUITAS
    this.aliquotFormCreate = this.formBuilder.group({
      IdAliquot: '',
      DatosVecino: '',
      ValorCuota: '',
      ValorExtra: '',
      Fecha: '',
      EstadoCuota: '',
      Descripcion: '',
      Mes: '',
      Anio: '',
      IdSeguimiento: '',
      NumeroMes: '',
    })

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

    //Seguimeito DATOS
    this.aliquotSeguimientoService.getPaymentTracking().subscribe(resp => {

      this.collectionAliquotSeguimientoLength = resp.length

      this.collectionAliquotSeguimiento.data = resp.map((e: any) => {
        //console.log('respuesta 2: ', e.payload.doc.data())
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          Anio: e.payload.doc.data().Anio,
          ValorCuota: e.payload.doc.data().ValorCuota,
          Descripcion: e.payload.doc.data().Descripcion,
          Estado: e.payload.doc.data().Estado,
          Fecha: e.payload.doc.data().Fecha,
          Mes: e.payload.doc.data().Mes,
          Total: e.payload.doc.data().Total,
          id: e.payload.doc.id,

        }
      })
    })
  }

  crearSeguimiento() {

    if (this.aliquotSeguimientoFormCreate.value.Fecha != '' &&
      this.aliquotSeguimientoFormCreate.value.Descripcion != '' &&
      this.aliquotSeguimientoFormCreate.value.ValorCuota != '' &&
      this.aliquotSeguimientoFormCreate.value.Estado != '') {

      this.fechaRepetida = false;
      console.log(this.numUser)
      console.log(this.collectionAliquotSeguimiento.data);

      var mes = this.aliquotSeguimientoFormCreate.value.Fecha.split('-')[1];
      var anio = this.aliquotSeguimientoFormCreate.value.Fecha.split('-')[0];

      this.fechaFinal = anio + '-' + mes

      for (let index = 0; index < this.collectionAliquotSeguimientoLength; index++) {
        this.fechas.push(this.collectionAliquotSeguimiento.data[index]['Fecha']);
        this.fechaRepetida = false;

      }

      //console.log(this.fechas);

      this.fechas.filter((fecha) => {
        if (this.fechaFinal == fecha) {
          console.log('repetida');
          this.fechaRepetida = true;
        }
      })

      console.log(this.fechaRepetida)

      if (this.fechaRepetida == false) {
        console.log('si se puede')
        var mes = this.aliquotSeguimientoFormCreate.value.Fecha.split('-')[1];
      var anio = this.aliquotSeguimientoFormCreate.value.Fecha.split('-')[0];
      console.log(mes)
      if (mes == '01') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Enero';
      } else if (mes == '02') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Febrero';
      } else if (mes == '03') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Marzo';
      } else if (mes == '04') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Abril';
      } else if (mes == '05') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Mayo';
      } else if (mes == '06') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Junio';
      } else if (mes == '07') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Julio';
      } else if (mes == '08') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Agosto';
      } else if (mes == '09') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Septiembre';
      } else if (mes == '10') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Octubre';
      } else if (mes == '11') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Noviembre';
      } else if (mes == '12') {
        this.aliquotSeguimientoFormCreate.value.Mes = 'Diciembre';
      }



      //--
      this.aliquotSeguimientoFormCreate.value.Anio = anio;
      this.aliquotSeguimientoFormCreate.value.Total = (this.aliquotSeguimientoFormCreate.value.ValorCuota * this.numUser);
      console.log(this.aliquotSeguimientoFormCreate.value);

      //--
      this.aliquotSeguimientoService.createPaymentTracking(this.aliquotSeguimientoFormCreate.value).then(resp => {

        // llaamado al servicio de creacion de copia de seguridad de alicuotas
        this.aliquotSeguimientoService.createPaymentTrackingBackUp(this.aliquotSeguimientoFormCreate.value);
        console.log(resp.id);
        this.seguimientoId = resp.id;
        for (let index = 0; index < this.collectionUsers.data.length; index++) {
          console.log(this.seguimientoId)
          const element = this.collectionUsers.data[index];
          const idAliquotRandom = Math.random().toString(36).substring(2);
          this.aliquotFormCreate.setValue({
            IdAliquot: idAliquotRandom,
            DatosVecino: element,
            ValorCuota: this.aliquotSeguimientoFormCreate.value.ValorCuota,
            ValorExtra: 0,
            Fecha: this.aliquotSeguimientoFormCreate.value.Fecha.split('T')[0],
            EstadoCuota: 'Pendiente',
            Descripcion: '',
            Mes: this.aliquotSeguimientoFormCreate.value.Mes,
            Anio: anio,
            IdSeguimiento: this.seguimientoId,
            NumeroMes: mes
          })
  
          this.aliquotService.createAliquotServices(this.aliquotFormCreate.value).then(resp => {
  
            // llaamado al servicio de creacion de copia de seguridad de alicuotas
            this.aliquotService.createAliquotBackupServices(this.aliquotFormCreate.value)
            //this.ngbModal.dismissAll();
            this.modalController.dismiss({
              'dismissed': true
            });
  
          }).catch(error => {
            //console.error(error)
          })
  
        }
        

      }).catch(error => {
        //console.error(error)
      })
        // seteo de datos de reservas por medio de datos de eventos
      } else if (this.fechaRepetida == true) {
        console.log('No se puede');

        this.FechaRepetida();

      }

    } else {
      this.presentToast();
    }

  }

  cancelar() {
    this.modalController.dismiss();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'danger',

    });
    toast.present();
  }
  async FechaRepetida() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Fecha ya existente</b>',
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
