import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

  // variable para paginacion
  config: any;
  collectionBooking;
  collectionBookingBackUp;
  collectionBookingLength;
  bookingLenght;
  uidAdmin;

  collectionBookingBooking;
  // variables para establecer id y uid de reservas
  collectionEvents;
  collectionEventsDelete;
  eventosLength;

  // formulario
  bookingFormCreate: FormGroup;


  bookingBookingFormCreate: FormGroup;

  //
  searchBarOpen = false;
  searchValue = false;

  selectedSegment: string = '';


  constructor(private bookingService: BookingService,
    private loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    public usersService: UsersService,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private eventsService: EventsService) { }

  ngOnInit() {

    //--------------------------------------------------------
    this.selectedSegment = sessionStorage.getItem('Parking')
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collectionBookingLength
    };

    // alicuotas para un solo usuario
    this.bookingService.getBookingServicesUser().subscribe(resp => {
      
      console.log(resp)
      
    })
    //--------------------------------------------------------
    //cargando todos los Bookings de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      this.bookingLenght = resp.length;
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBooking = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          BookingAN: e.payload.doc.data().BookingAN,
          Fecha: e.payload.doc.data().Reserva.Fecha.split('T')[0],
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
          uidBooking: e.payload.doc.id
        }
      })
      //console.log(this.collectionBooking)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBookingBackUp = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          BookingAN: e.payload.doc.data().BookingAN,
          Fecha: e.payload.doc.data().Reserva.Fecha.split('T')[0],
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          UidBookingBooking: e.payload.doc.data().idBookingBooking,
          uidBooking: e.payload.doc.id
        }
      })
      //console.log(this.collectionBooking)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    //--------------------------------------------------------
    this.eventsService.getEventsServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      this.eventosLength = resp.length;
      //console.log(this.eventosLength)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionEvents = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          UidEventBooking: e.payload.doc.data().idBookingBooking,
          Img: e.payload.doc.data().Img

        }
      })
      //console.log(this.collectionEvents)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    //--------------------------------------------------------



  }

  async filterList(evt) {
    this.collectionBooking = this.collectionBookingBackUp;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.collectionBooking = this.collectionBooking.filter(currentFood => {
      if (currentFood.Lugar && searchTerm) {
        return (currentFood.Lugar.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Fecha.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentFood.Lugar.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }


  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el Booking
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

  deleteBooking(item: any) {
    this.config.currentPage = 1;
    console.log('reserva:');
    console.log(item.id);
    console.log(item.UidBookingBooking);

    for (let index = 0; index < this.eventosLength; index++) {
      if (this.collectionEvents[index]['UidEventBooking'] == item.UidBookingBooking) {
        console.log('evento')
        this.collectionEventsDelete = this.collectionEvents[index];
        console.log(this.collectionEventsDelete.id)
        console.log(this.collectionEventsDelete.UidEventBooking)

        this.eventsService.deleteEventsServices(this.collectionEventsDelete.id);
      }


    }
    this.bookingService.deleteBookingServices(item.id);



  }

  async createUserModal() {


    this.modalController.create({
      component: BookingCreateComponent,
      //cssClass: 'style-modal-create-booking'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  async editBookingModal(item: any) {


    //seteo de variables en el form editar

    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: BookingEditComponent,
      componentProps: item,
      //cssClass: 'style-modal-edite-booking'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });


  }

  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
    this.selectedSegment = ev.target.value;
  }
}
