import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { UsersService } from 'src/app/services/users/users.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-seguimiento-register',
  templateUrl: './seguimiento-register.component.html',
  styleUrls: ['./seguimiento-register.component.scss']
})
export class SeguimientoRegisterComponent implements OnInit {
  // variable de configuracion para la paginacion
  config: any;
  // coleccion de usuarios
  collectionUsers = { count: 0, data: [] }

  // coleccion de aliquotas
  collectionAliquotSeguimiento = { count: 0, data: [] };
  collectionAliquotSeguimientoBackUp = { count: 0, data: [] };
  collectionAliquotSeguimientoLength;
  numUser;
  // uid
  uidAdmin;
  //
  closeResult = '';
  fechasFilter;
  fechas = [];
  fechaRepetida: boolean;
  // Estado evento
  // arreglo de estado "Pagado o no"
  statusEvent = [
    'Pagada',
    'Pendiente'
  ]

  idAliquotSeguimiento;
  idAliquotSeguimientoLenght;

  seguimiento: boolean;
  seguimientoId;
  idSeguimientoUpdate;
  // formulario para crear alicuotas
  aliquotFormCreate: FormGroup;
  aliquotFormUpdate: FormGroup;

  // forms
  alicuotaSeguimientoFormCreate: FormGroup;
  alicuotaSeguimientoFormEdit: FormGroup;

  //
  actualizar: boolean;

  constructor(public usersService: UsersService,
    private aliquotSeguimientoService: AliquotSeguimientoService,
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,
    private aliquotService: AliquotService,) { }

  ngOnInit(): void {
    this.actualizar = false;
    this.fechaRepetida = false;
    this.seguimiento = false;
    // seteo de las variables de configuracion de la paginacion
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collectionAliquotSeguimientoLength,
    };
    this.usersService.getUsersServices().subscribe(resp => {
      //console.log(resp.length);
      this.numUser = resp.length;
    })

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

    this.aliquotSeguimientoService.getPaymentTracking().subscribe(resp => {

      //this.collectionAliquotSeguimientoLength = resp.length

      this.collectionAliquotSeguimientoBackUp.data = resp.map((e: any) => {
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

    this.uidAdmin = localStorage.getItem('userId')

    this.alicuotaSeguimientoFormCreate = this.formBuilder.group({
      IdUser: this.uidAdmin,
      Descripcion: '',
      Fecha: '',
      Mes: '',
      Anio: '',
      ValorCuota: '',
      Total: '',
      Estado: 'Pendiente'
    })
    this.alicuotaSeguimientoFormEdit = this.formBuilder.group({
      Descripcion: '',
      Estado: ''
    })

    this.aliquotFormUpdate = this.formBuilder.group({
      EstadoCuota: '',
      DescripcionMensual: ''
    })
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
      DescripcionMensual: ''
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
  }

  pageChanged(event) {

    // seteo de la configuracion del cambio de pagina
    this.config.currentPage = event;

  }

  //funcion - metodo guardar o crear un evento
  createAliquotSeguimiento() {
    console.log(this.alicuotaSeguimientoFormCreate.value.ValorCuota)
    if (this.alicuotaSeguimientoFormCreate.value.ValorCuota == null || this.alicuotaSeguimientoFormCreate.value.ValorCuota == '') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El valor de la cuota no puede estar vacio',
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      console.log('Si vale')
      if (this.alicuotaSeguimientoFormCreate.value.Descripcion !== '' && this.alicuotaSeguimientoFormCreate.value.Fecha !== '' &&
        (this.alicuotaSeguimientoFormCreate.value.ValorCuota != '' || this.alicuotaSeguimientoFormCreate.value.ValorCuota != null)) {

        this.fechaRepetida = false;
        console.log(this.numUser)
        //console.log(this.collectionAliquotSeguimiento.data);
        //console.log(this.alicuotaSeguimientoFormCreate.value);
        for (let index = 0; index < this.collectionAliquotSeguimientoLength; index++) {
          this.fechas.push(this.collectionAliquotSeguimiento.data[index]['Fecha']);
          this.fechaRepetida = false;

        }

        //console.log(this.fechas);
        this.fechas.filter((fecha) => {
          if (this.alicuotaSeguimientoFormCreate.value.Fecha == fecha) {
            //console.log('repetida');
            this.fechaRepetida = true;
          }
        })

        //console.log(this.fechaRepetida)

        if (this.fechaRepetida == false) {
          //console.log('si se puede')
          var mes = this.alicuotaSeguimientoFormCreate.value.Fecha.split('-')[1];
          var anio = this.alicuotaSeguimientoFormCreate.value.Fecha.split('-')[0];
          console.log(mes)
          if (mes == '01') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Enero';
          } else if (mes == '02') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Febrero';
          } else if (mes == '03') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Marzo';
          } else if (mes == '04') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Abril';
          } else if (mes == '05') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Mayo';
          } else if (mes == '06') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Junio';
          } else if (mes == '07') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Julio';
          } else if (mes == '08') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Agosto';
          } else if (mes == '09') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Septiembre';
          } else if (mes == '10') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Octubre';
          } else if (mes == '11') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Noviembre';
          } else if (mes == '12') {
            this.alicuotaSeguimientoFormCreate.value.Mes = 'Diciembre';
          }



          //--
          this.alicuotaSeguimientoFormCreate.value.Anio = anio;
          this.alicuotaSeguimientoFormCreate.value.Estado = 'Pendientes';
          this.alicuotaSeguimientoFormCreate.value.Total = (this.alicuotaSeguimientoFormCreate.value.ValorCuota * this.numUser);
          console.log(this.alicuotaSeguimientoFormCreate.value);
          this.aliquotSeguimientoService.createPaymentTracking(this.alicuotaSeguimientoFormCreate.value).then(resp => {

            // llaamado al servicio de creacion de copia de seguridad de alicuotas
            this.aliquotSeguimientoService.createPaymentTrackingBackUp(this.alicuotaSeguimientoFormCreate.value);
            console.log(resp.id);
            this.seguimientoId = resp.id;
            for (let index = 0; index < this.collectionUsers.data.length; index++) {
              console.log(this.seguimientoId)
              const element = this.collectionUsers.data[index];
              const idAliquotRandom = Math.random().toString(36).substring(2);
              this.aliquotFormCreate.setValue({
                IdAliquot: idAliquotRandom,
                DatosVecino: element,
                ValorCuota: this.alicuotaSeguimientoFormCreate.value.ValorCuota,
                ValorExtra: 0,
                Fecha: this.alicuotaSeguimientoFormCreate.value.Fecha,
                EstadoCuota: 'Pendiente',
                Descripcion: '',
                Mes: this.alicuotaSeguimientoFormCreate.value.Mes,
                Anio: anio,
                IdSeguimiento: this.seguimientoId,
                NumeroMes: mes,
                DescripcionMensual: this.alicuotaSeguimientoFormCreate.value.Descripcion
              })

              this.aliquotService.createAliquotServices(this.aliquotFormCreate.value).then(resp => {

                // llaamado al servicio de creacion de copia de seguridad de alicuotas
                this.aliquotService.createAliquotBackupServices(this.aliquotFormCreate.value)
                //this.ngbModal.dismissAll();
                this.ngbModal.dismissAll();

              }).catch(error => {
                //console.error(error)
              })

            }

          }).catch(error => {
            //console.error(error)
          })



          // seteo de datos de reservas por medio de datos de eventos
        } else if (this.fechaRepetida == true) {
          //console.log('No se puede');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Fecha ya escogida elija otra fecha',
            showConfirmButton: false,
            timer: 2000
          });
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe llenar todos los campos para crear un evento',
          showConfirmButton: false,
          timer: 2000
        });
      }
    }







  }

  // Abri form para editar un evento
  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {
    console.log(item)
    //llenar form para editar con los datos seteados a partir del formulario
    this.alicuotaSeguimientoFormEdit.setValue({
      Descripcion: item.Descripcion,
      Estado: item.Estado
    })
    this.idSeguimientoUpdate = item.id;
    this.aliquotSeguimientoService.getAliquotOnlyThisPaymentTracking(this.idSeguimientoUpdate).subscribe(resp => {
      //console.log(resp);
      this.idAliquotSeguimiento = resp;
      this.idAliquotSeguimientoLenght = resp.length;

    })

    if (item.Estado == 'Pagada') {
      this.alicuotaSeguimientoFormEdit.controls['Estado'].disable();
      this.alicuotaSeguimientoFormEdit.controls['Descripcion'].disable();
    }else{
      this.alicuotaSeguimientoFormEdit.controls['Estado'].enable();
      this.alicuotaSeguimientoFormEdit.controls['Descripcion'].enable();
    }
    // Apertura del modal para el formulario
    this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
      );

  }

  // Abrir form para crear un evento
  openFormCreate(contentCreate) {

    this.actualizar = false;
    // apertura del modelform de crear
    this.ngbModal.open(contentCreate, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  updateSeguimiento() {

    if (this.alicuotaSeguimientoFormEdit.value.Descripcion != '' &&
      this.alicuotaSeguimientoFormEdit.value.Estado != '') {
      this.aliquotFormUpdate.value.EstadoCuota = this.alicuotaSeguimientoFormEdit.value.Estado;
      this.aliquotFormUpdate.value.DescripcionMensual = this.alicuotaSeguimientoFormEdit.value.Descripcion;
      this.aliquotSeguimientoService.updatePaymentTracking(this.idSeguimientoUpdate, this.alicuotaSeguimientoFormEdit.value).then(resp => {
        this.alicuotaSeguimientoFormEdit.reset();
        this.ngbModal.dismissAll();
      })
      for (let index = 0; index < this.idAliquotSeguimientoLenght; index++) {
        const element = this.idAliquotSeguimiento[index];
        //console.log(element)
        //console.log(this.aliquotFormUpdate.value.EstadoCuota)
        this.aliquotSeguimientoService.updateAliquotServicesPayment(element, this.aliquotFormUpdate.value)
      }

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El seguimiento debe contener una descripcion',
        showConfirmButton: false,
        timer: 2000
      });
    }

  }

  // metodo para cerrar y eliminar datos seteados sino se envian
  private getDismissReason(reason: any): string {

    // por tecla esc, dar click fuera del form o en la x
    if (reason === ModalDismissReasons.ESC) {
      this.alicuotaSeguimientoFormCreate.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.alicuotaSeguimientoFormCreate.reset();
      return 'by clicking on a backdrop';
    } else {
      this.alicuotaSeguimientoFormCreate.reset();
      return `with: ${reason}`;
    }

  }

  async filterList(evt) {
    console.log(evt)
    this.collectionAliquotSeguimiento.data = this.collectionAliquotSeguimientoBackUp.data;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.collectionAliquotSeguimiento.data = this.collectionAliquotSeguimiento.data.filter(currentFood => {
      if (currentFood.Descripcion && searchTerm) {
        return (currentFood.Descripcion.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currentFood.Anio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currentFood.Mes.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
