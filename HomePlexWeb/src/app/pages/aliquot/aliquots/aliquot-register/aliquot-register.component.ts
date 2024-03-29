import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

// servicios de alicuotas
import { AliquotService } from '../../../../services/aliquot/aliquot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';

@Component({
  selector: 'app-aliquot-register',
  templateUrl: './aliquot-register.component.html',
  styleUrls: ['./aliquot-register.component.scss']
})
export class AliquotRegisterComponent implements OnInit {

  // variable de configuracion para la paginacion
  config: any;

  // coleccion de usuarios
  collectionUsers = { count: 0, data: [] }

  // coleccion de aliquotas
  collectionAliquots = { count: 0, data: [] }

  collectionAliquotSeguimiento = { count: 0, data: [] };
  collectionAliquotBackUp = { count: 0, data: [] };
  collectionAliquotSeguimientoLength;

  // arreglo de estado "Pagado o no"
  estadoCuotaList = [
    'Pagada',
    'Pendiente',
    'No pagada'
  ]

  // formulario para crear alicuotas
  aliquotFormCreate: FormGroup;

  // id par actualizar la alicuota
  IdAliquotUpdate;

  // formulario para la edicion de alicuotas
  aliquotFormEdit: FormGroup;

  aliquotSeguimientoUpdate: FormGroup;

  // variables de estado
  closeResult = '';
  actualizar: boolean;
  totalSeguimiento = 0;
  ValorExtraAntiguo = 0;

  // fecha actual
  fechaActual;
  fechaVencimiento;
  fechaSelect;
  IdSeguimientoUpdateTotal;
  totalSeguimientoUpdate = 0;

  // iniciar servicios
  constructor(private aliquotService: AliquotService,
    public usersService: UsersService,
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,
    private aliquotSeguimientoService: AliquotSeguimientoService,) { }

  ngOnInit(): void {

    // seteo de la fecha actual
    this.fechaActual = Date.now();

    // seteo de las variables de configuracion de la paginacion
    this.config = {
      itemsPerPage: 7,
      currentPage: 1,
      totalItems: this.collectionAliquots.data.length,
    };

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

    //cargando todos los usuarios de firebase-firestore
    this.aliquotService.getAliquotServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de las alicuotas en el arreglo collectionAliquots
      this.collectionAliquots.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          DatosVecinoNombre: e.payload.doc.data().DatosVecino.Nombre,
          ValorCuota: e.payload.doc.data().ValorCuota,
          ValorExtra: e.payload.doc.data().ValorExtra,
          Fecha: e.payload.doc.data().Fecha,
          Mes: e.payload.doc.data().Mes,
          Anio: e.payload.doc.data().Anio,
          EstadoCuota: e.payload.doc.data().EstadoCuota,
          Descripcion: e.payload.doc.data().Descripcion,
          IdAliquot: e.payload.doc.data().IdAliquot,
          NumeroMes: e.payload.doc.data().NumeroMes,
          IdSeguimiento: e.payload.doc.data().IdSeguimiento,
          DescripcionMensual: e.payload.doc.data().DescripcionMensual,
        }
      })
      //console.log(this.collectionAliquots.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    this.aliquotService.getAliquotServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de las alicuotas en el arreglo collectionAliquots
      this.collectionAliquotBackUp.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          DatosVecinoNombre: e.payload.doc.data().DatosVecino.Nombre,
          ValorCuota: e.payload.doc.data().ValorCuota,
          ValorExtra: e.payload.doc.data().ValorExtra,
          Fecha: e.payload.doc.data().Fecha,
          Mes: e.payload.doc.data().Mes,
          Anio: e.payload.doc.data().Anio,
          EstadoCuota: e.payload.doc.data().EstadoCuota,
          Descripcion: e.payload.doc.data().Descripcion,
          IdAliquot: e.payload.doc.data().IdAliquot,
          NumeroMes: e.payload.doc.data().NumeroMes,
          IdSeguimiento: e.payload.doc.data().IdSeguimiento,
          DescripcionMensual: e.payload.doc.data().DescripcionMensual,
        }
      })
      //console.log(this.collectionAliquots.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    // aleatorio para la alicuota

    //iniciar formulario para la creacion de alicuotas
    this.aliquotFormCreate = this.formBuilder.group({
      IdAliquot: '',
      DatosVecino: '',
      ValorCuota: '',
      ValorExtra: '',
      Fecha: '',
      Mes: '',
      Anio: '',
      EstadoCuota: '',
      Descripcion: '',

    })

    // formulario para la edicion de alicuotas
    this.aliquotFormEdit = this.formBuilder.group({
      DatosVecino: this.formBuilder.group({
        Nombre: ''
      }),
      ValorCuota: '',
      ValorExtra: '',
      Fecha: '',
      EstadoCuota: '',
      Descripcion: ''
    })

    this.aliquotSeguimientoUpdate = this.formBuilder.group({
      Total: '',
    })



  }

  // metodo de paginacion
  pageChanged(event) {

    // seteo de la configuracion del cambio de pagina
    this.config.currentPage = event;

  }

  // funcion - metodo para la creacion de las alicuotas
  createAliquot() {
    const idAliquotRandom = Math.random().toString(36).substring(2);
    this.aliquotFormCreate.value.IdAliquot = idAliquotRandom;

    //console.table(this.aliquotFormCreate.value)
    // llamado al servicio de creacion de alicuotas
    this.aliquotService.createAliquotServices(this.aliquotFormCreate.value).then(resp => {

      // llaamado al servicio de creacion de copia de seguridad de alicuotas
      this.aliquotService.createAliquotBackupServices(this.aliquotFormCreate.value)
      this.ngbModal.dismissAll();

    }).catch(error => {
      //console.error(error)
    })

  }

  // apertura del modal para la creacion de alicuotas
  open(content) {

    // apertura del modal
    this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //this.aliquotFormCreate.reset();
    }, (reason) => {
      //this.aliquotFormCreate.reset();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  // metodo de descartamiento de ngmodl y form
  private getDismissReason(reason: any): string {

    // metodo de descarte por boton esc, dar click en otra parte o en la x del formulario
    if (reason === ModalDismissReasons.ESC) {
      this.aliquotFormCreate.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.aliquotFormCreate.reset();
      return 'by clicking on a backdrop';
    } else {
      this.aliquotFormCreate.reset();
      return `with: ${reason}`;
    }
  }

  // Funcion - metodo para setear la fecha de vencimiento 1 mes despues o mas 
  // de acuerdo a la fecha designada primera
  cambio(fechaEnviada) {

    //console.log(fecha)
    this.fechaSelect = Date.parse(fechaEnviada)
    //console.log(this.FechaFecha)
    var mesDespues = 30 * 24 * 60 * 60 * 1000
    this.fechaVencimiento = this.fechaSelect + mesDespues;

  }

  //---------------------------------------------------

  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {

    //console.log(item.ValorExtra)
    this.ValorExtraAntiguo = item.ValorExtra;
    this.aliquotFormEdit.setValue({
      DatosVecino: ({
        Nombre: item.DatosVecinoNombre
      }),
      ValorCuota: item.ValorCuota,
      ValorExtra: item.ValorExtra,
      Fecha: item.Fecha.split('T')[0],
      EstadoCuota: item.EstadoCuota,
      Descripcion: item.Descripcion
    })

    // seteo de que no sea editable la variable de nombre en la alicuota
    this.aliquotFormEdit.controls['DatosVecino'].disable();
    this.aliquotFormEdit.controls['ValorCuota'].disable();
    this.aliquotFormEdit.controls['Fecha'].disable()
    if (item.EstadoCuota == 'Pagada') {
      this.aliquotFormEdit.controls['ValorExtra'].disable();
      this.aliquotFormEdit.controls['EstadoCuota'].disable();
      this.aliquotFormEdit.controls['Descripcion'].disable()
    }else{
      this.aliquotFormEdit.controls['ValorExtra'].enable();
      this.aliquotFormEdit.controls['EstadoCuota'].enable();
      this.aliquotFormEdit.controls['Descripcion'].enable()
    }
    // igualancion del uid del usuario actual a la variable id firebase
    this.IdAliquotUpdate = item.id;
    this.IdSeguimientoUpdateTotal = item.IdSeguimiento;
    this.aliquotSeguimientoService.getPaymentTrackingUnic(this.IdSeguimientoUpdateTotal).subscribe(resp => {
      //console.log(resp)

      this.totalSeguimientoUpdate = resp
    })
    // cambiar el estado de la variable booleana a true
    this.actualizar = true;

    // Apertura del modal para el formulario
    this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
      );

  }

  // funcio - metodo para la actualizacion de un alicuota
  updateAliquot() {
    //console.log('valor nuevo ' + this.aliquotFormEdit.value.ValorExtra)
    //console.log('Valor antiguo ' + this.ValorExtraAntiguo)
    //console.log('Total: ' + this.totalSeguimientoUpdate)
    if (this.aliquotFormEdit.value.ValorExtra > this.ValorExtraAntiguo) {
      //console.log('Mayor')
      this.aliquotSeguimientoUpdate.value.Total = (this.totalSeguimientoUpdate + (this.aliquotFormEdit.value.ValorExtra - this.ValorExtraAntiguo));
      this.aliquotSeguimientoService.updatePaymentTracking(this.IdSeguimientoUpdateTotal, this.aliquotSeguimientoUpdate.value).then(resp=>{
        //console.log(resp)
      })
    } else if (this.aliquotFormEdit.value.ValorExtra < this.ValorExtraAntiguo) {
      this.aliquotSeguimientoUpdate.value.Total = (this.totalSeguimientoUpdate - (this.ValorExtraAntiguo - this.aliquotFormEdit.value.ValorExtra));
      this.aliquotSeguimientoService.updatePaymentTracking(this.IdSeguimientoUpdateTotal, this.aliquotSeguimientoUpdate.value).then(resp=>{
        //console.log(resp)
      })
    } else {
      console.log('valor queda igual');  
    }

    
    
    // condicionamiento para que el id de la alicuota no se nulla ni indefinida
    if (this.IdAliquotUpdate !== null || this.IdAliquotUpdate !== undefined) {

      // llamado al servicio de actualizacion de alicuotas
      this.aliquotService.updateAliquotServices(this.IdAliquotUpdate, this.aliquotFormEdit.value).then(resp => {

        // llamado a las funciones de reseteo y cerrado de ngforms

        this.aliquotFormEdit.reset();
        this.ngbModal.dismissAll();

      }).catch(error => {
        //console.error(error);
      });
    }
  }

  async filterList(evt) {
    console.log(evt)
    this.collectionAliquots.data = this.collectionAliquotBackUp.data;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.collectionAliquots.data = this.collectionAliquots.data.filter(currentFood => {
      if (currentFood.DatosVecinoNombre && searchTerm) {
        return (currentFood.DatosVecinoNombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currentFood.Anio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currentFood.Mes.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
