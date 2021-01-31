import { Component, OnInit } from '@angular/core';

// servicio de eventos
import { EventsService } from '../../services/events/events.service';

// firebase
import { AngularFireStorage } from '@angular/fire/storage';

//importaciones extras
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {
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

  // uid firestore evento
  uidEvent: string;

  // variable de bandera de actualizacion
  actualizar: boolean;

  // variable para paginacion
  config: any;

  // arreglo de collecion de eventos
  collection = { count: 0, data: [] }

  // iniciar servicios
  constructor(private storage: AngularFireStorage, private ngbModal: NgbModal,
    public formBuilder: FormBuilder, private eventsService: EventsService) { }

  ngOnInit(): void {

    // seteo de la fecha actual
    this.fechaActual= Date.now()
    // iniciar variable de Uid Firestore evento
    this.uidEvent

    // iniciar variable de bander de actualizacion
    this.actualizar = false;

    // configuracion de la paginacion
    this.config = {
      itemsPorPagina: 5,
      paginaActual: 1,
      itemsTotales: this.collection.data.length
    }

    // inicializacion del formulario de eventos  
    this.uidAdmin =  localStorage.getItem('userId')
    this.eventsForm = this.formBuilder.group({
      idUser: this.uidAdmin,
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

    // 
    this.eventsBookingForm = this.formBuilder.group({
      idUserReserv: '',
      Ocupado: '',
      Reserva: this.formBuilder.group({
        Lugar: '',
        Fecha: Date.toString,
        Duracion: '',
        Personas: ''
      })

    })

    //cargando todos los usuarios de firebase-firestore
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
          uidEvent: e.payload.doc.id 
        }

      })
      //console.log(this.collection.data)

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
      }
    );

  }

  // funcion-metodo para el cambio de pagina segun la pagina actual
  cambioPagina(event){

    // configura la variable de la pagina actual segun un evento 
    this.config.paginaActual = event;

  }

  // funcion - metodo para borrar cualquier evento
  deleteEvent(item: any){

    // llamado al servicio de eliminacion
    this.eventsService.deleteEventsServices(item.uidEvent);

  }

  // funcion - metodo guardar o crear un evento
  createEvent(){

    // seteo de datos de reservas por medio de datos de eventos
    this.eventsBookingForm.setValue({
      idUserReserv: this.eventsForm.value.idUser,
      Ocupado: 'si',
      Reserva: ({
        Lugar: this.eventsForm.value.Reserva.Lugar,
        Fecha: this.eventsForm.value.Reserva.Fecha,
        Duracion: this.eventsForm.value.Reserva.Duracion,
        Personas: this.eventsForm.value.Reserva.Personas
      })

    })
  
    // llamado al servicio de creacion de eventosde acuerdo a los datos del form
    this.eventsService.createEventsServices(this.eventsForm.value).then(resp =>{

      // llamado al servicio de creacion de reservas de acuerdo a los datos del formde reservas igualando datos con el form de de eventos
      this.eventsService.createBookingServices(this.eventsBookingForm.value);

      // resetea el form y lo cierra
      this.eventsForm.reset();
      this.ngbModal.dismissAll();

    }).catch(err =>{

      // impirmir error si es que diera alguno
      console.log(err)

    })

  }

  //
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

}
