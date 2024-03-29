import { Component, OnInit } from '@angular/core';

// servicio de eventos
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BookingService } from 'src/app/services/booking/booking.service';

// firebase
import { AngularFireStorage } from '@angular/fire/storage';

//importaciones extras
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.scss']
})

export class EventRegisterComponent implements OnInit {

  //  numero de personas posibles
  peopleEvent = [
    '1 - 5 personas',
    '5 - 10 personas'
  ]

  // Lugar de los eventos
  placeEvent = [
    'Casa comunal',
    'Canchas deportivas',
    'Parqueadero'
  ]

  // Duracion de eventos con intervalo de 3 horas
  durationEvent = [
    '7 a.m - 10 a.m',
    '10 a.m - 13 p.m',
    '13 p.m - 16 p.m',
    '16 p.m - 19 p.m',
    '19 p.m - 22 p.m'
  ]

  // Estado evento
  statusEvent = [
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

  // formulario para agregar eventos
  eventsForm: FormGroup;

  // formulario para agregar reserva a partir del evento
  eventsBookingForm: FormGroup;

  // formulario para agregar una imagen y esta setearla en la creacion de un evento
  eventImgForm: FormGroup;

  // formulario para la edicion de un evento
  eventFormEdit: FormGroup;

  // formulario para la edicion de una reserva
  eventBookingFormEdit: FormGroup;

  // uid firestore evento
  uidEventEdit: string;

  // variable de bandera de actualizacion
  actualizar: boolean;

  // variable para paginacion
  config: any;

  // arreglo de collecion de eventos
  collection = { count: 0, data: [] }
  collectionEventsBackUp = { count: 0, data: [] };

  collectionReserva = [];

  // arreglo de colleccion de reservas
  collectionBooking = { count: 0, data: [] }
  collectionEventsBookingLength;
  collectionEventsBookingDelete;

  // variables para establecer id y uid de reservas
  aVar;
  bVar;

  // Variables para la subida de imagenes
  imgEdit;
  filepath;
  file;
  fileRef;
  task;
  uploadPercent;
  validImg;

  usersList = [];
  nameUserInfor;
  repeatBooking;
  repeatEvent;

  // iniciar servicios
  constructor(private storage: AngularFireStorage, private ngbModal: NgbModal,
    public formBuilder: FormBuilder, private eventsService: EventsService,
    public usersService: UsersService, private bookingService: BookingService) { }

  ngOnInit(): void {

    // seteo de la fecha actual
    var fecha = Date.now();
    //console.log(fecha)
    var diaDespues = 1 * 24 * 60 * 60 * 1000;
    //console.log(diaDespues);
    this.fechaActual = fecha + diaDespues;
    //console.log(this.fechaActual)
    // iniciar variable de Uid Firestore evento
    this.uidEventEdit

    // iniciar variable de bander de actualizacion
    this.actualizar = false;

    // configuracion de la paginacion
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    // inicializacion del formulario de eventos
    const idRandomEvent = Math.random().toString(36).substring(2);
    this.uidAdmin = localStorage.getItem('userId')
    this.eventsForm = this.formBuilder.group({
      idUser: this.uidAdmin,
      idBookingBooking: '',
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: 'En espera',
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Duracion: '',
        Fecha: Date.toString,
        Lugar: '',
        Personas: ''
      })
    })

    // inicializacion de formulario para la edicion de un evento
    this.eventFormEdit = this.formBuilder.group({
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      idBookingBooking: '',
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Duracion: '',
        Fecha: Date.toString,
        Lugar: '',
        Personas: ''
      })
    })

    // iniciar formulario para la subida de imagenes
    this.eventImgForm = this.formBuilder.group({
      Img: ['']
    })

    // Iniciar formulario para la creacion de reservas a partir de datos de un evento
    this.eventsBookingForm = this.formBuilder.group({
      idBookingBooking: '',
      BookingAN: 'En espera',
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Lugar: '',
        Fecha: Date.toString,
        Duracion: '',
        Personas: ''
      }),
      UserInfo: this.formBuilder.group({
        userNameReserv: '',
        idUserReserv: '',
      })
    })

    ///
    this.eventBookingFormEdit = this.formBuilder.group({
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Lugar: '',
        Fecha: Date.toString,
        Duracion: '',
        Personas: ''
      })
    })

    //cargando todos los eventos de firebase-firestore
    this.eventsService.getEventsServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collection.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          Nombre: e.payload.doc.data().Nombre,
          EventoAN: e.payload.doc.data().EventoAN,
          Fecha: e.payload.doc.data().Reserva.Fecha,
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          Img: e.payload.doc.data().Img,
          UidEventBooking: e.payload.doc.data().idBookingBooking,
          uidEvent: e.payload.doc.id
        }
      })
      //console.log(this.collection.data)
    }, error => {
      // imprimir en caso de que de algun error
      //console.error(error);
    }
    );
    //cargando todos los eventos de firebase-firestore
    this.eventsService.getEventsServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionEventsBackUp.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          Nombre: e.payload.doc.data().Nombre,
          EventoAN: e.payload.doc.data().EventoAN,
          Fecha: e.payload.doc.data().Reserva.Fecha,
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          Img: e.payload.doc.data().Img,
          UidEventBooking: e.payload.doc.data().idBookingBooking,
          uidEvent: e.payload.doc.id
        }
      })
      //console.log(this.collection.data)
    }, error => {
      // imprimir en caso de que de algun error
      //console.error(error);
    }
    );

    //cargando todos los usuarios de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      this.collectionEventsBookingLength = resp.length
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBooking.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          UidEventBooking: e.payload.doc.data().idBookingBooking
        }
      })

      //console.log(this.collectionBooking.data)
    }, error => {
      // imprimir en caso de que de algun error
      //console.error(error);
    }
    );


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
  pageChanged(event) {
    this.config.currentPage = event;
    //console.log(this.config.totalItems)
  }

  // funcion - metodo para borrar cualquier evento
  deleteEvent(item: any) {

    Swal.fire({
      title: 'Esta seguro que desea borrar el evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(item)
        console.log(item.uidEvent);
        console.log(item.UidEventBooking);
        this.storage.refFromURL(item.Img).delete()
        this.eventsService.deleteEventsServices(item.uidEvent).then(resp=>{
          console.log(resp)
          this.eventsService.deletebooking(item.UidEventBooking).subscribe(resp => {
            const idbooking = resp[0]
            console.log(resp)
            if (resp.length == 1) {
              this.bookingService.deleteBookingServices(idbooking);
            } else if (resp.length != 1) {
  
            }
  
          }).closed
        })
        

        Swal.fire(
          'Evento borrado!',
        )
      }
    })





  }

  //funcion - metodo guardar o crear un evento
  createEvent() {

    //console.log(this.eventImgForm.value)

    if (this.eventsForm.value.Reserva.Descripcion !== '' && this.eventsForm.value.Reserva.Lugar !== '' &&
      this.eventsForm.value.Reserva.Fecha !== '' && this.eventsForm.value.Reserva.Duracion !== '' && this.eventsForm.value.Reserva.Personas !== '' &&
      this.eventImgForm.value.Img !== '') {

        const refereArray = this.collectionReserva.filter(x=> x.Fecha == this.eventsForm.value.Reserva.Fecha && x.Duracion == this.eventsForm.value.Reserva.Duracion && x.Lugar ==this.eventsForm.value.Reserva.Lugar );
        console.log(refereArray)
        if (refereArray.length == 1) {
          console.log('Ya existe')

          this.eventsForm.reset();
          this.ngbModal.dismissAll();
          Swal.fire('Ya existe el evento')
        }else if (refereArray.length == 0) {
          console.log('No existe')
          this.guardar();
        }
            
          


    } else {
      console.log('No se puede');
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe llenar todos los campos para crear un evento',
        showConfirmButton: false,
        timer: 2000
      });
    }
    // seteo de datos de reservas por medio de datos de eventos

  }

  guardar() {
    const idRandomEvent = Math.random().toString(36).substring(2);
    this.eventsForm.value.idBookingBooking = idRandomEvent;
    this.eventsForm.value.Img = this.eventImgForm.value.Img;
    this.eventsBookingForm.setValue({
      idBookingBooking: this.eventsForm.value.idBookingBooking,
      BookingAN: this.eventsForm.value.EventoAN,
      Reserva: ({
        Descripcion: this.eventsForm.value.Reserva.Descripcion,
        Lugar: this.eventsForm.value.Reserva.Lugar,
        Fecha: this.eventsForm.value.Reserva.Fecha,
        Duracion: this.eventsForm.value.Reserva.Duracion,
        Personas: this.eventsForm.value.Reserva.Personas
      }),
      UserInfo: ({
        userNameReserv: this.nameUserInfor,
        idUserReserv: this.uidAdmin,
      })
    })
    console.log('guardar')
    this.bookingService.createBookingServices(this.eventsBookingForm.value);
    this.eventsService.createEventsServices(this.eventsForm.value);
    this.eventsForm.reset();
    this.ngbModal.dismissAll();
    
            

  }

  // Abri form para editar un evento
  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {

    //llenar form para editar con los datos seteados a partir del formulario
    this.imgEdit = item.Img

    //seteo de variables en el form editar
    this.eventFormEdit.setValue({
      Img: this.imgEdit,
      Nombre: item.Nombre,
      EventoAN: item.EventoAN,
      idBookingBooking: item.UidEventBooking,
      Reserva: ({
        Descripcion: item.Descripcion,
        Duracion: item.Duracion,
        Fecha: item.Fecha,
        Lugar: item.Lugar,
        Personas: item.Personas
      })
    });

    // igualancion del uid del usuario actual a la variable id firebase
    this.uidEventEdit = item.uidEvent;

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

  // Abrir form para crear un evento
  openFormCreate(contentCreate) {

    // cambio de estado de actualizarion
    this.actualizar = false;
    this.imgEdit = '';
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
      this.eventsForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.eventsForm.reset();
      return 'by clicking on a backdrop';
    } else {
      this.eventsForm.reset();
      return `with: ${reason}`;
    }

  }

  // funcion - metodo para la subida de imagenes a firestone
  uploadFile(event) {

    this.file = event.target.files[0];
    this.validImg = (/\.(jpg|png)$/i).test(this.file.name)
    console.log((/\.(jpg|png)$/i).test(this.file.name))
    console.log(this.file.size);
    if (this.file.size < 2500000 && this.validImg == true) {
      // variable random para id de las imagenes
      const idRandom = Math.random().toString(36).substring(2);

      // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store


      // establecimiento de la estructura de guardad en store
      this.filepath = 'events/' + idRandom;

      // tareas y referencia del path 
      this.fileRef = this.storage.ref(this.filepath);
      this.task = this.storage.upload(this.filepath, this.file);

      // Observador para ver el porcentaje de subida o tiempo que tarda en subir
      this.uploadPercent = this.task.percentageChanges();

      // obtenr noticicacion de que la url del archivo subido esta diponible y su pertinente obtencion mediante mapeo
      this.task.snapshotChanges().pipe(
        last(),
        switchMap(() =>
          this.fileRef.getDownloadURL()
        )
      ).subscribe(url => {
        // seteo de la variable Img de form para obtenecion la imagen en un arreglo y asi subirla al respectivo campo de Img ela firestore del usuario
        this.imgEdit = url
        this.eventImgForm.setValue({
          Img: url
        })
      })
    } else {
      event.srcElement.value = '';
      this.file = '';
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Imagen con tamaño mayor a 2.5MB o formato inadecuado, recuerde solo se admite jpg o png',
        showConfirmButton: false,
        timer: 2000
      });
    }



  }

  // funcion o metodo actualizar un evento
  updateEvent() {

    // seteo de valires en el form de editar de reservas
    if (this.eventFormEdit.value.Reserva.Descripcion !== '' &&
      this.eventFormEdit.value.Reserva.Duracion !== '' &&
      this.eventFormEdit.value.Reserva.Fecha !== '' &&
      this.eventFormEdit.value.Reserva.Lugar !== '' &&
      this.eventFormEdit.value.Reserva.Personas) {

      this.eventBookingFormEdit.setValue({
        Reserva: ({
          Descripcion: this.eventFormEdit.value.Reserva.Descripcion,
          Duracion: this.eventFormEdit.value.Reserva.Duracion,
          Fecha: this.eventFormEdit.value.Reserva.Fecha,
          Lugar: this.eventFormEdit.value.Reserva.Lugar,
          Personas: this.eventFormEdit.value.Reserva.Personas
        })
      })
      this.collectionBooking.data.map(res => {
        const a = res.id
        const b = res.UidEventBooking
        //console.log("a: ", a, "b", b)
        if (this.eventFormEdit.value.idBookingBooking == b) {
          this.bookingService.updateBookingServices(a, this.eventBookingFormEdit.value)
        }
      })


      // llamado a la variable uid del usuario y verificacion de si es nula o no
      if (this.uidEventEdit !== null || this.uidEventEdit !== undefined) {

        // igualacion de variables de imagenes
        this.eventFormEdit.value.Img = this.imgEdit

        // servicio de acutalizacion de ventos
        this.eventsService.updateEventsServices(this.uidEventEdit, this.eventFormEdit.value).then(resp => {
          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.eventFormEdit.reset();
          this.ngbModal.dismissAll();
        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
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

  async filterList(evt) {
    console.log(evt)
    this.collection.data = this.collectionEventsBackUp.data;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.collection.data = this.collection.data.filter(currentFood => {
      if (currentFood.Nombre && searchTerm) {
        return (currentFood.Nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Fecha.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Lugar.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
