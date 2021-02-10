import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  // variable para paginacion
  config: any;
  collectionEvents;
  collectionEventsLength;

  constructor(private eventsService: EventsService) { }

  ngOnInit() {

    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.collectionEventsLength
    };

    this.eventsService.getEventsServices().subscribe(resp=>{
      this.collectionEvents = resp
      this.collectionEventsLength = resp.length
      //console.log(resp.length)
      //console.log(this.collectionEvents)
    })

  }

  
  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }
  
}
