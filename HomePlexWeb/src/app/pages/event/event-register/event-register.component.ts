import { Component, OnInit } from '@angular/core';

// servicio de eventos
import { EventsService } from 'src/app/services/events/events.service';

// firebase
import { AngularFireStorage } from '@angular/fire/storage';

//importaciones extras
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { UsersService } from 'src/app/services/users/users.service';
import { last, switchMap } from 'rxjs/operators';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { templateJitUrl } from '@angular/compiler';
import { BookingService } from 'src/app/services/booking/booking.service';

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
  // variables
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
  collectionBooking = { count: 0, data: [] }
  aVar;
  bVar;

  // Variables para la subida de imagenes

  imgEdit;
  filepath;
  file;
  fileRef;
  task;
  uploadPercent;
  

  // iniciar servicios
  constructor(private storage: AngularFireStorage, private ngbModal: NgbModal,
    public formBuilder: FormBuilder, private eventsService: EventsService,
    public usersService: UsersService, private bookingService: BookingService) { }

  ngOnInit(): void {

    // seteo de la fecha actual
    this.fechaActual = Date.now()
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
      idEventBooking: idRandomEvent,
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
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
      Img:'',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      idEventBooking: '',
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
      idUserReserv:  '',
      idEventBooking: '',
      Ocupado: '',
      Reserva: this.formBuilder.group({
        Descripcion: '',
        Lugar: '',
        Fecha: Date.toString,
        Duracion: '',
        Personas: ''
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
          UidEventBooking: e.payload.doc.data().idEventBooking,
          uidEvent: e.payload.doc.id
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
          UidEventBooking: e.payload.doc.data().idEventBooking,
          
        }

      })
      this.collectionBooking.data.map(res =>{
        this.aVar = res.id
        this.bVar = res.UidEventBooking
        //console.log("a: ", this.aVar , "b", this.bVar)
      })
      //console.log(this.collectionBooking.data)

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );


  }

  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {
    this.config.currentPage = event;
    console.log(this.config.totalItems)
  }

  // funcion - metodo para borrar cualquier evento
  deleteEvent(item: any) {
    // llamado al servicio de eliminacion
    this.eventsService.deleteEventsServices(item.uidEvent);

   if (item.UidEventBooking == this.bVar ) {
     this.bookingService.deleteBookingServices(this.aVar)
   }
    this.storage.refFromURL(item.Img).delete()
  }

  // funcion - metodo guardar o crear un evento
  createEvent() {
    //console.log(this.eventImgForm.value)
    // seteo de datos de reservas por medio de datos de eventos
    this.eventsBookingForm.setValue({
      idUserReserv: this.uidAdmin,
      Ocupado: 'si',
      idEventBooking:this.eventsForm.value.idEventBooking,
      Reserva: ({
        Descripcion: this.eventsForm.value.Reserva.Descripcion,
        Lugar: this.eventsForm.value.Reserva.Lugar,
        Fecha: this.eventsForm.value.Reserva.Fecha,
        Duracion: this.eventsForm.value.Reserva.Duracion,
        Personas: this.eventsForm.value.Reserva.Personas
      })

    })
    this.eventsForm.value.Img = this.eventImgForm.value.Img
    // llamado al servicio de creacion de eventosde acuerdo a los datos del form
    this.eventsService.createEventsServices(this.eventsForm.value).then(resp => {
      //console.log(resp)
      // llamado al servicio de creacion de reservas de acuerdo a los datos del formde reservas igualando datos con el form de de eventos
      this.bookingService.createBookingServices(this.eventsBookingForm.value).then(resp2 =>{
        //console.log(resp2)
      });

      // resetea el form y lo cierra
      this.eventsForm.reset();
      this.ngbModal.dismissAll();

    }).catch(err => {

      // impirmir error si es que diera alguno
      console.log(err)

    })

  }

  // Abri form para editar un evento
  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {

    //llenar form para editar con los datos seteados a partir del formulario
    this.imgEdit = item.Img

    this.eventFormEdit.setValue({
      Img: this.imgEdit,
      Nombre: item.Nombre,
      EventoAN: item.EventoAN,
      idEventBooking:item.UidEventBooking,
      Reserva: ({
        Descripcion: item.Descripcion,
        Duracion: item.Duracion,
        Fecha: item.Fecha,
        Lugar: item.Lugar,
        Personas: item.Personas
      })
    });

    

    //console.log(this.eventFormEdit.value)
    //console.log(this.eventBookingFormEdit.value)
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
    this.actualizar = false;
    this.ngbModal.open(contentCreate, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  uploadFile(event) {

    const idRandom = Math.random().toString(36).substring(2);
    // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store
    this.file = event.target.files[0];
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

  }

  //
  // funcion o metodo actualizar usuario
  updateEvent() {
    
    this.eventBookingFormEdit.setValue({
      Reserva: ({
        Descripcion: this.eventFormEdit.value.Reserva.Descripcion,
        Duracion: this.eventFormEdit.value.Reserva.Duracion,
        Fecha: this.eventFormEdit.value.Reserva.Fecha,
        Lugar: this.eventFormEdit.value.Reserva.Lugar,
        Personas: this.eventFormEdit.value.Reserva.Personas
      })
    })
    if (this.eventFormEdit.value.idEventBooking == this.bVar ) {
      this.bookingService.updateBookingServices(this.aVar, this.eventBookingFormEdit.value)
    }
    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (this.uidEventEdit !== null || this.uidEventEdit !== undefined) {
      //
      this.eventFormEdit.value.Img = this.imgEdit
      // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
      //console.log(this.eventFormEdit.value)
      //console.log(this.eventBookingFormEdit.value)
      this.eventsService.updateEventsServices(this.uidEventEdit, this.eventFormEdit.value).then(resp => {
        
        // funciones de reseteo del formulario y cerrar modal al igual que el formulario
        this.eventFormEdit.reset();
        this.ngbModal.dismissAll();

      }).catch(error => {
        // comprobacion de errores 
        console.error(error);
        });
    }
    
  }


}