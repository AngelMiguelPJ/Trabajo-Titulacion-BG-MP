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
  uidBookingEdit: string;

  // variable de bandera de actualizacion
  actualizar: boolean;

  // variable para paginacion
  config: any;

  // arreglo de collecion de reservas
  collection = { count: 0, data: [] }

  // arreglo de colleccion de reservas
  collectionBooking = { count: 0, data: [] }

  // variables para establecer id y uid de reservas
  aVar;
  bVar;

  usersList = [];
  nameUserInfor;


  constructor(
    private storage: AngularFireStorage,
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    private bookingService: BookingService) { }

  ngOnInit(): void {

    // seteo de la fecha actual
    this.fechaActual = Date.now()
    // iniciar variable de Uid Firestore reserva
    this.uidBookingEdit

    // iniciar variable de bander de actualizacion
    this.actualizar = false;

    // configuracion de la paginacion
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    // inicializacion del formulario de reservas
    const idRandomBooking = Math.random().toString(36).substring(2);
    this.uidAdmin = localStorage.getItem('userId')
    this.bookingsForm = this.formBuilder.group({
      idBookingBooking: '',
      BookingAN: ['', Validators.required],
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

    //cargando todos los usuarios de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBooking.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          UidBookingBooking: e.payload.doc.data().idBookingBooking
        }
      })
      this.collectionBooking.data.map(res => {
        this.aVar = res.id
        this.bVar = res.UidBookingBooking
        //console.log("a: ", this.aVar , "b", this.bVar)
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


  }
  // funcion - metodo para el cambio de pagina segun la pagina actual
  pageChanged(booking) {
    this.config.currentPage = booking;
    console.log(this.config.totalItems)
  }

  // funcion - metodo para borrar cualquier reserva
  deleteBooking(item: any) {

    // llamado al servicio de eliminacion de reservas 
    this.bookingService.deleteBookingServices(item.uidBooking);

    this.collectionBooking.data.map(res => {
      const a = res.id
      const b = res.UidBookingBooking
      //console.log("a: ", a, "b", b)
      // llamado al servico de eliminacion de reservas 
      if (item.UidBookingBooking == b) {
        this.bookingService.deleteBookingServices(a)
      }
    })

  }

  //funcion - metodo guardar o crear un reserva
  createBooking() {

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
    

    // llamado al servicio de creacion de reservasde acuerdo a los datos del form
    this.bookingService.createBookingServices(this.bookingsForm.value).then(resp => {

      // resetea el form y lo cierra
      this.bookingsForm.reset();
      this.ngbModal.dismissAll();

    }).catch(err => {
      // impirmir error si es que diera alguno
      console.log(err)
    }) 

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
    this.uidBookingEdit = item.uidBooking;

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

    // seteo de valires en el form de editar de reservas
    this.bookingFormEdit.setValue({
      BookingAN: this.bookingFormEdit.value.BookingAN,
      Reserva: ({
        Descripcion: this.bookingFormEdit.value.Reserva.Descripcion,
        Duracion: this.bookingFormEdit.value.Reserva.Duracion,
        Fecha: this.bookingFormEdit.value.Reserva.Fecha,
        Lugar: this.bookingFormEdit.value.Reserva.Lugar,
        Personas: this.bookingFormEdit.value.Reserva.Personas
      })
    })
    this.collectionBooking.data.map(res => {
      const a = res.id
      const b = res.UidBookingBooking
      console.log("a: ", a, "b", b)
      if (this.bookingFormEdit.value.idBookingBooking == b) {
        this.bookingService.updateBookingServices(a, this.bookingFormEdit.value)
      }
    })


    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (this.uidBookingEdit !== null || this.uidBookingEdit !== undefined) {

      // servicio de acutalizacion de ventos
      this.bookingService.updateBookingServices(this.uidBookingEdit, this.bookingFormEdit.value).then(resp => {
        // funciones de reseteo del formulario y cerrar modal al igual que el formulario
        this.bookingFormEdit.reset();
        this.ngbModal.dismissAll();
      }).catch(error => {
        // comprobacion de errores 
        console.error(error);
      });
    }

  }

}

