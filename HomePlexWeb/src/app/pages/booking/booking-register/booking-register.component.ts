import { Component, OnInit } from '@angular/core';

// servicio de reservas
import { UsersService } from 'src/app/services/users/users.service';
import { BookingService } from 'src/app/services/booking/booking.service';

// firebase
import { AngularFireStorage } from '@angular/fire/storage';

//importaciones extras
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events/events.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-booking-register',
  templateUrl: './booking-register.component.html',
  styleUrls: ['./booking-register.component.scss']
})
export class BookingRegisterComponent implements OnInit {
  //  numero de personas posibles
  peopleBooking = [
    '1 - 5 personas',
    '5 - 10 personas'
  ]

  // Lugar de los reservas
  placeBooking = [
    'Casa comunal',
    'Canchas deportivas',
    'Parqueadero'
  ]

  // Duracion de reservas con intervalo de 3 horas
  durationBooking = [
    '7 a.m - 10 a.m',
    '10 a.m - 13 p.m',
    '13 p.m - 16 p.m',
    '16 p.m - 19 p.m',
    '19 p.m - 22 p.m'
  ]

  // Estado reserva
  statusBooking = [
    'Aprobado',
    'En espera',
    'Desaprobado'
  ]

  // uid
  uidAdmin;

  // fecha actual
  fechaActual;
  fechaRecibida;

  // variables de cerrado
  closeResult = '';

  // formulario para agregar reservas
  bookingsForm: FormGroup;

  // formulario para agregar reserva a partir del reserva
  ///bookingsBookingForm: FormGroup;

  // formulario para la edicion de un reserva
  bookingFormEdit: FormGroup;

  // formulario para la edicion de una reserva
  //bookingBookingFormEdit: FormGroup;

  // uid firestore reserva
  idBookingEdit;
  uidBookingEdit;

  // variable de bandera de actualizacion
  actualizar: boolean;

  // variable para paginacion
  config: any;
  cuenta: boolean;

  // arreglo de collecion de reservas
  collection = { count: 0, data: [] };
  collectionBackUp = { count: 0, data: [] };
  // arreglo de colleccion de reservas
  collectionBooking = { count: 0, data: [] };
  collectionEvents = { count: 0, data: [] };
  collectionEventsDelete;
  eventosLength;
  eventsFormEdit: FormGroup;
  collectionEventsEdit;
  // variables para establecer id y uid de reservas
  aVar;
  bVar;
  repeatBooking;

  usersList = [];
  nameUserInfor;
  collectionReserva = [];


  constructor(
    private storage: AngularFireStorage,
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    private bookingService: BookingService,
    private eventsService: EventsService,
    public userService: UsersService) { }

  ngOnInit(): void {

    this.cuenta = false;
    this.repeatBooking = false;
    // seteo de la fecha actual
    // seteo de la fecha actual
    var fecha = Date.now();
    //console.log(fecha)
    var diaDespues = 1 * 24 * 60 * 60 * 1000;
    //console.log(diaDespues);
    this.fechaActual = fecha + diaDespues;


    // iniciar variable de bander de actualizacion
    this.actualizar = false;

    // configuracion de la paginacion
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    // inicializacion del formulario de reservas
    const idRandomBooking = Math.random().toString(36).substring(2);
    this.uidAdmin = localStorage.getItem('userId')
    console.log(this.userService.isAdmin)
    if (this.userService.isAdmin == true) {
      this.bookingsForm = this.formBuilder.group({
        idBookingBooking: '',
        BookingAN: 'En espera',
        Reserva: this.formBuilder.group({
          Descripcion: '',
          Duracion: '',
          Fecha: Date.toString,
          Lugar: '',
          Personas: ''
        }),
        UserInfo: this.formBuilder.group({
          userNameReserv: '',
          idUserReserv: '',
        })
      })
    } else {
      this.bookingsForm = this.formBuilder.group({
        idBookingBooking: '',
        BookingAN: 'En espera',
        Reserva: this.formBuilder.group({
          Descripcion: '',
          Duracion: '',
          Fecha: Date.toString,
          Lugar: '',
          Personas: ''
        }),
        UserInfo: this.formBuilder.group({
          userNameReserv: '',
          idUserReserv: '',
        })
      })
    }


    // inicializacion de formulario para la edicion de un reserva
    this.bookingFormEdit = this.formBuilder.group({
      BookingAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Duracion: '',
        Fecha: Date.toString,
        Lugar: '',
        Personas: ''
      })
    })

    this.eventsFormEdit = this.formBuilder.group({
      EventoAN: '',
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Lugar: '',
        Fecha: '',
        Duracion: '',
        Personas: ''
      })
    })

    //cargando todos los reservas de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collection.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          BookingAN: e.payload.doc.data().BookingAN,
          Fecha: e.payload.doc.data().Reserva.Fecha,
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
          uidBooking: e.payload.doc.id
        }
      })
      //console.log(this.collection.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    //cargando todos los reservas de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBackUp.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          BookingAN: e.payload.doc.data().BookingAN,
          Fecha: e.payload.doc.data().Reserva.Fecha,
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
          uidBooking: e.payload.doc.id
        }
      })
      //console.log(this.collection.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    //cargando todos los usuarios de firebase-firestore
    this.eventsService.getEventsServices().subscribe(resp => {
      console.log('respuesta 1: ', resp.length)
      this.eventosLength = resp.length;
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionEvents.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
          Img: e.payload.doc.data().Img
        }
      })

      //console.log(this.collectionBooking.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    // Llamado al servicio de usuarios para obtener datos de acuerdo al usuario actual
    this.usersService.getUsersService().subscribe(users => {
      // seteo de datos en un arreglo
      this.usersList = users
      // condicion for para recorrer el arreglo
      for (let index = 0; index < this.usersList.length; index++) {
        // igualacion de cada indice del arreglo a una variable mientras recorre
        const uides = this.usersList[index];
        // condicional para obtener solo los datos del usuario actual
        if (uides.Uid === this.uidAdmin) {
          // seteo de los datos pertinentes al usuario actual
          this.nameUserInfor = uides.Name

        }
      }
    })

    //cargando todos los eventos de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionReserva = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          Fecha: e.payload.doc.data().Reserva.Fecha,
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
        }
      })
      //console.log(this.collection.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );


  }
  // funcion - metodo para el cambio de pagina segun la pagina actual
  pageChanged(booking) {
    this.config.currentPage = booking;
    console.log(this.config.totalItems)
  }

  // funcion - metodo para borrar cualquier reserva
  deleteBooking(item: any) {

    Swal.fire({
      title: 'Esta seguro que desea borrar la reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        // llamado al servicio de eliminacion de reservas 
        console.log('Borrar reserva:');
        console.log(item.id);
        console.log(item.UidBookingBooking);

        this.cuenta = false;
        
        this.bookingService.deleteBookingServices(item.id).then(resp=>{
          console.log(resp)

          this.bookingService.deleteEvent(item.UidBookingBooking).subscribe(resp => {
            const idbooking = resp[0]
              console.log(resp.length)
              if (resp.length == 1) {
                this.eventsService.deleteEventsServices(idbooking);
                //this.storage.refFromURL(idbooking[0]['Img']).delete()
              } else if (resp.length != 1) {
    
              }
  
          }).closed
         
        
        })
       

        Swal.fire(
          'Reserva borrada!',
        )
      }
    })




  }

  //funcion - metodo guardar o crear un reserva


  createBooking() {
    //console.log('as')

    if (this.bookingsForm.value.Reserva.Descripcion != '' &&
      this.bookingsForm.value.Reserva.Lugar != '' && this.bookingsForm.value.Reserva.Fecha != '' &&
      this.bookingsForm.value.Reserva.Duracion != '' && this.bookingsForm.value.Reserva.Personas != '') {
      
        const refereArray = this.collectionReserva.filter(x=> x.Fecha == this.bookingsForm.value.Reserva.Fecha && x.Duracion == this.bookingsForm.value.Reserva.Duracion && x.Lugar ==this.bookingsForm.value.Reserva.Lugar );
        console.log(refereArray)

        if (refereArray.length == 1) {
          console.log('Ya existe')

          this.bookingsForm.reset();
          this.ngbModal.dismissAll();
          Swal.fire('Ya existe la reserva')
        }else if (refereArray.length == 0) {
          console.log('No existe')
          this.guardar();
        }

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe llenar todos los campos para crear una reserva',
        showConfirmButton: false,
        timer: 2000
      });
    }


  }

  guardar(){
    // seteo de datos de reservas por medio de datos de reservas
    const idRandomBooking = Math.random().toString(36).substring(2);
    this.bookingsForm.value.idBookingBooking = idRandomBooking
    this.bookingsForm.setValue({
      idBookingBooking: this.bookingsForm.value.idBookingBooking,
      BookingAN: this.bookingsForm.value.BookingAN,
      Reserva: ({
        Descripcion: this.bookingsForm.value.Reserva.Descripcion,
        Lugar: this.bookingsForm.value.Reserva.Lugar,
        Fecha: this.bookingsForm.value.Reserva.Fecha,
        Duracion: this.bookingsForm.value.Reserva.Duracion,
        Personas: this.bookingsForm.value.Reserva.Personas
      }),
      UserInfo: ({
        userNameReserv: this.nameUserInfor,
        idUserReserv: this.uidAdmin,
      })
    })

    this.bookingService.createBookingServices(this.bookingsForm.value);
    this.bookingsForm.reset();
    this.ngbModal.dismissAll();
  }

  // Abri form para editar un reserva
  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {

    //llenar form para editar con los datos seteados a partir del formulario
    //seteo de variables en el form editar
    this.bookingFormEdit.setValue({
      BookingAN: item.BookingAN,
      Reserva: ({
        Descripcion: item.Descripcion,
        Duracion: item.Duracion,
        Fecha: item.Fecha,
        Lugar: item.Lugar,
        Personas: item.Personas
      })
    });

    // igualancion del uid del usuario actual a la variable id firebase
    this.idBookingEdit = item.id;
    this.uidBookingEdit = item.UidBookingBooking;

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

  // Abrir form para crear un reserva
  openFormCreate(contentCreate) {

    // cambio de estado de actualizacion
    this.actualizar = false;

    // apertura del modelform de crear
    this.ngbModal.open(contentCreate, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  // metodo para cerrar y eliminar datos seteados sino se envian
  private getDismissReason(reason: any): string {

    // por tecla esc, dar click fuera del form o en la x
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }

  // funcion o metodo actualizar un reserva
  updateBooking() {
    console.log(this.collection.data);
    // seteo de valires en el form de editar de reservas
    console.log(this.bookingFormEdit.value)

    if (this.bookingFormEdit.value.BookingAN != '' && this.bookingFormEdit.value.Reserva.Descripcion != '' &&
      this.bookingFormEdit.value.Reserva.Lugar != '' && this.bookingFormEdit.value.Reserva.Fecha != '' &&
      this.bookingFormEdit.value.Reserva.Duracion != '' && this.bookingFormEdit.value.Reserva.Personas != '') {
      if (this.bookingFormEdit.value.Reserva.Descripcion !== '') {
        this.eventsFormEdit.setValue({
          EventoAN: this.bookingFormEdit.value.BookingAN,
          Reserva: ({
            Descripcion: this.bookingFormEdit.value.Reserva.Descripcion,
            Lugar: this.bookingFormEdit.value.Reserva.Lugar,
            Fecha: this.bookingFormEdit.value.Reserva.Fecha,
            Duracion: this.bookingFormEdit.value.Reserva.Duracion,
            Personas: this.bookingFormEdit.value.Reserva.Personas
          })
        })
        console.log('eventos', this.eventsFormEdit.value)
        //-------------------
        for (let index = 0; index < this.eventosLength; index++) {
          if (this.collectionEvents.data[index]['UidBookingBooking'] == this.uidBookingEdit) {
            console.log('evento')
            this.collectionEventsEdit = this.collectionEvents.data[index];
            console.log(this.collectionEventsEdit.id);
            console.log(this.collectionEventsEdit.UidBookingBooking);
            //this.bookingService.deleteBookingServices(item.id);
            //this.eventsService.deleteEventsServices(this.collectionEventsDelete.id);
            this.bookingService.updateBookingServices(this.idBookingEdit, this.bookingFormEdit.value).then(resp => {
              // funciones de reseteo del formulario y cerrar modal al igual que el formulario
              //this.eventsFormEdit.reset();

            }).catch(error => {
              // comprobacion de errores 
              console.error(error);
            });
            this.eventsService.updateEventsServices(this.collectionEventsEdit.id, this.eventsFormEdit.value).then(resp => {
              // funciones de reseteo del formulario y cerrar modal al igual que el formulario
              //this.eventsFormEdit.reset();

            }).catch(error => {
              // comprobacion de errores 
              console.error(error);
            });
            this.ngbModal.dismissAll();
          } else {
            this.bookingService.updateBookingServices(this.idBookingEdit, this.bookingFormEdit.value).then(resp => {
              // funciones de reseteo del formulario y cerrar modal al igual que el formulario
              //this.eventsFormEdit.reset();
              this.ngbModal.dismissAll();
            }).catch(error => {
              // comprobacion de errores 
              console.error(error);
            });
          }


        }
        //---------------

      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe llenar todos los campos para crear una reserva',
        showConfirmButton: false,
        timer: 2000
      });
    }



  }

  async filterList(evt) {
    console.log(evt)
    this.collection.data = this.collectionBackUp.data;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.collection.data = this.collection.data.filter(currentFood => {
      if (currentFood.Descripcion && searchTerm) {
        return (currentFood.Descripcion.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Lugar.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Fecha.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}

