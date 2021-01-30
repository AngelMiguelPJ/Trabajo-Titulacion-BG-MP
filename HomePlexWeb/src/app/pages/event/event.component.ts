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

  // variables
  closeResult = '';

  // formulario para agregar eventos
  eventsForm: FormGroup;

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
    this.eventsForm = this.formBuilder.group({
      id: null,
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      Detalles: [({
        Fecha: '',
        Duracion: '',
        Lugar: '',
        Descripcion: '',
        Personas: ''
      }), Validators.required]
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
          Fecha: e.payload.doc.data().Detalles.Fecha,
          Duracion: e.payload.doc.data().Detalles.Duracion,
          Lugar: e.payload.doc.data().Detalles.Lugar,
          Descripcion: e.payload.doc.data().Detalles.Descripcion,
          Personas: e.payload.doc.data().Detalles.Personas,
          uidEvent: e.payload.doc.id 
        }
      })
      console.log(this.collection)

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );



  }



}
