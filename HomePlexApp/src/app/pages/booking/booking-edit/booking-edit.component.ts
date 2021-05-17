import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking/booking.service';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.scss'],
})
export class BookingEditComponent implements OnInit {

  //  numero de personas posibles
  peopleEvent = [
    '1 - 5 personas',
    '5 - 10 personas'
  ]

  // Lugar de los Booking
  placeEvent = [
    'Casa comunal',
    'Canchas deportivas',
    'Parqueadero'
  ]

  // Duracion de Booking con intervalo de 3 horas
  durationBooking = [
    '7 a.m - 10 a.m',
    '10 a.m - 13 p.m',
    '13 p.m - 16 p.m',
    '16 p.m - 19 p.m',
    '19 p.m - 22 p.m'
  ]

  // Estado Booking
  statusBooking = [
    'Aprobado',
    'En espera',
    'Desaprobado'
  ]

  // fecha actual
  fechaActual;

  // RESERVA-EVENTOS O Reservas
  bookingFormEdit: FormGroup;
  eventsFormEdit: FormGroup;
  eventosLength;
  collectionEvents;
  idbooking;
  idBookingEventos;
  collectionEventsEdit;

  constructor(private navParams: NavParams,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private bookingService: BookingService,
    private eventService: EventsService,
    public usersService: UsersService) { }

  ngOnInit() {

    // seteo de la fecha actual
    this.fechaActual = Date.now()
    console.log(this.navParams.data)
    //id de booking
    this.idbooking = this.navParams.data.id;
    this.idBookingEventos = this.navParams.data.UidBookingBooking;
    this.bookingFormEdit = this.formBuilder.group({
      BookingAN: this.navParams.data.BookingAN,
      Reserva: this.formBuilder.group({
        Descripcion: this.navParams.data.Descripcion,
        Lugar: this.navParams.data.Lugar,
        Fecha: this.navParams.data.Fecha,
        Duracion: this.navParams.data.Duracion,
        Personas: this.navParams.data.Personas
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
    ///console.log(this.bookingFormEdit.value.Reserva)
    // iniciar formulario para la subida de imagenes
    this.eventService.getEventsServices().subscribe(resp => {
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
          UidEventBooking: e.payload.doc.data().idEventBooking,
          Img: e.payload.doc.data().Img

        }
      })
      //console.log(this.collectionEvents)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }

  guardar() {
    console.log(this.bookingFormEdit.value)
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
        if (this.collectionEvents[index]['UidEventBooking'] == this.idBookingEventos) {
          console.log('evento')
          this.collectionEventsEdit = this.collectionEvents[index];
          console.log(this.collectionEventsEdit.id);
          console.log(this.collectionEventsEdit.UidEventBooking);
          //this.bookingService.deleteBookingServices(item.id);
          //this.eventsService.deleteEventsServices(this.collectionEventsDelete.id);
          this.bookingService.updateBookingServices(this.idbooking, this.bookingFormEdit.value).then(resp => {
            // funciones de reseteo del formulario y cerrar modal al igual que el formulario
            //this.eventsFormEdit.reset();

          }).catch(error => {
            // comprobacion de errores 
            console.error(error);
          });
          this.eventService.updateEventsServices(this.collectionEventsEdit.id, this.eventsFormEdit.value).then(resp => {
            // funciones de reseteo del formulario y cerrar modal al igual que el formulario
            //this.eventsFormEdit.reset();

          }).catch(error => {
            // comprobacion de errores 
            console.error(error);
          });
          this.modalController.dismiss({
            'dismissed': true
          });
        }else{
          this.bookingService.updateBookingServices(this.idbooking, this.bookingFormEdit.value).then(resp => {
            // funciones de reseteo del formulario y cerrar modal al igual que el formulario
            //this.eventsFormEdit.reset();
            this.modalController.dismiss({
              'dismissed': true
            });
          }).catch(error => {
            // comprobacion de errores 
            console.error(error);
          });
        }
        
        
      }
      //---------------
      
    } else {
      this.presentToast();
    }
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'danger',

    });
    toast.present();
  }


}
