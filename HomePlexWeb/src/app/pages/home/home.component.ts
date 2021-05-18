import { Component, OnInit } from '@angular/core';

// servicios de firebase
import { AngularFireStorage } from '@angular/fire/storage';

// servios - librerias extras
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';

// servicios de eventos
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  // arreglo de collecion de eventos
  collection = { count: 0, data: [] }
  collectionEventsLenght;

  // variables para la navegacion en el carrosuel
  showNavigationArrows = false;
  showNavigationIndicators = false;

  // variables de cuotas
  aliquotCurrentMonth;
  aliquotCurrentMonthLenght;
  aliquotLastMonth;
  aliquotLastMonthLenght;

  // iniciar servicios
  constructor(private eventsService: EventsService,
              private aliquotService: AliquotService) { }

  ngOnInit(): void {

    //cargando todos los eventos de firebase-firestore
    this.eventsService.getEventsServices().subscribe(resp => {
      console.log('respuesta 1: ', resp)
      this.collectionEventsLenght = resp.length;
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collection.data = resp.map((e: any) => {
        console.log('respuesta 2: ', e)
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

     this.aliquotService.getAliquotUserCurrentMonth().subscribe(res => {
      //console.log(res.length);
      this.aliquotCurrentMonth = res;
      this.aliquotCurrentMonthLenght = res.length;
      //console.log(this.aliquotCurrentMonth.lenght)
    })
 this.aliquotService.getAliquotUserLastMonth().subscribe(res => {
      //console.log(res);
      this.aliquotLastMonth = res;
      this.aliquotLastMonthLenght = res.length;
      //console.log(this.aliquotCurrentMonth)
    })

  }

}
