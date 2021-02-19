import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
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
  uidAdmin;

  // formulario
  eventsFormCreate: FormGroup;
  eventsFormEdit: FormGroup;

  eventsImg: FormGroup;

  eventsBookingFormCreate: FormGroup;
  eventsBookingFormEdit: FormGroup;
  

  constructor(private eventsService: EventsService,
    private loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    public usersService: UsersService
    
    ) {
      this.presentLoading()
     }

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
    });

    this.uidAdmin = localStorage.getItem('userId');

    this.eventsFormCreate = this.formBuilder.group({
      idUser: this.uidAdmin,
      idEventBooking: '',
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Duracion: ['', Validators.required],
        Fecha: Date.toString,
        Lugar: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    });

    // inicializacion de formulario para la edicion de un evento
    this.eventsFormEdit = this.formBuilder.group({
      idEventBooking: '',
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Duracion: ['', Validators.required],
        Fecha: Date.toString,
        Lugar: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    });

    // iniciar formulario para la subida de imagenes
    this.eventsImg = this.formBuilder.group({
      Img: ''
    })

    // Iniciar formulario para la creacion de reservas a partir de datos de un evento
    this.eventsBookingFormCreate = this.formBuilder.group({
      idUserReserv: '',
      idEventBooking: '',
      Ocupado: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Lugar: ['', Validators.required],
        Fecha: Date.toString,
        Duracion: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    })

    ///
    this.eventsBookingFormEdit = this.formBuilder.group({
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Lugar: ['', Validators.required],
        Fecha: Date.toString,
        Duracion: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    })

  }

  
  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }

  deleteEvent(item: any) {

    // llamado al servicio de eliminacion de eventos 
    this.eventsService.deleteEventsServices(item.uidEvent);



    // llamado al servicio de eliminacion de imagenes
    this.storage.refFromURL(item.Img).delete()

  }
  
}
