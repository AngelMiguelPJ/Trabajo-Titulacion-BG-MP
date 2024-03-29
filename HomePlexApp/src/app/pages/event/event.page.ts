import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoadingController, ModalController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  // variable para paginacion
  config: any;
  collectionEvents;
  collectionEventsBackUp;
  collectionEventsLength;
  eventosLength;
  uidAdmin;

  collectionEventsBooking;
  collectionEventsBookingLength;
  // variables para establecer id y uid de reservas
  collectionEventsBookingDelete;

  uidEventEdit;

  // formulario
  eventsFormCreate: FormGroup;
  eventsFormEdit: FormGroup;

  eventsImg: FormGroup;

  eventsBookingFormCreate: FormGroup;
  eventsBookingFormEdit: FormGroup;

  //
  searchBarOpen = false;
  searchValue = false;


  constructor(private eventsService: EventsService,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    public usersService: UsersService,
    public modalController: ModalController) { }

  ngOnInit() {

    //--------------------------------------------------------
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.collectionEventsLength
    };
    //--------------------------------------------------------
    //cargando todos los eventos de firebase-firestore
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
          Nombre: e.payload.doc.data().Nombre,
          EventoAN: e.payload.doc.data().EventoAN,
          Fecha: e.payload.doc.data().Reserva.Fecha.split('T')[0],
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          Img: e.payload.doc.data().Img,
          UidEventBooking: e.payload.doc.data().idBookingBooking,
          uidEvent: e.payload.doc.id
        }
      })
      //console.log(this.collectionEvents)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    this.eventsService.getEventsServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionEventsBackUp = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          Nombre: e.payload.doc.data().Nombre,
          EventoAN: e.payload.doc.data().EventoAN,
          Fecha: e.payload.doc.data().Reserva.Fecha.split('T')[0],
          Duracion: e.payload.doc.data().Reserva.Duracion,
          Lugar: e.payload.doc.data().Reserva.Lugar,
          Descripcion: e.payload.doc.data().Reserva.Descripcion,
          Personas: e.payload.doc.data().Reserva.Personas,
          Img: e.payload.doc.data().Img,
          UidEventBooking: e.payload.doc.data().idBookingBooking,
          uidEvent: e.payload.doc.id
        }
      })
      console.log(this.collectionEvents)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    //--------------------------------------------------------
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      this.collectionEventsBookingLength = resp.length
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionEventsBooking = resp.map((e: any) => {
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
      console.error(error);
    }
    );
    //--------------------------------------------------------


    // inicializacion de formulario para la edicion de un evento
    this.eventsFormEdit = this.formBuilder.group({
      idEventBooking: '',
      Img: '',
      Nombre: ['', Validators.required],
      EventoAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Duracion: ['', Validators.required],
        Fecha: ['', Validators.required],
        Lugar: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    });



    // Iniciar formulario para la creacion de reservas a partir de datos de un evento


    ///
    this.eventsBookingFormEdit = this.formBuilder.group({
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Lugar: ['', Validators.required],
        Fecha: ['', Validators.required],
        Duracion: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    })

  }

  async filterList(evt) {
    this.collectionEvents = this.collectionEventsBackUp;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.collectionEvents = this.collectionEvents.filter(currentFood => { 
      if (currentFood.Nombre && searchTerm) {
        return (currentFood.Nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
                || currentFood.Fecha.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currentFood.Lugar.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      } 
    });
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
    this.config.currentPage = 1;
    // llamado al servicio de eliminacion de eventos 
    console.log(item)
    console.log(item.uidEvent);
    console.log(item.UidEventBooking);

    for (let index = 0; index < this.collectionEventsBookingLength; index++) {
      if (this.collectionEventsBooking[index]['UidEventBooking'] == item.UidEventBooking) {
        console.log('reserva')
        this.collectionEventsBookingDelete = this.collectionEventsBooking[index];
        console.log(this.collectionEventsBookingDelete.id)
        console.log(this.collectionEventsBookingDelete.UidEventBooking)

        this.bookingService.deleteBookingServices(this.collectionEventsBookingDelete.id);
      }


    }

    this.eventsService.deleteEventsServices(item.uidEvent);

    // llamado al servicio de eliminacion de imagenes
    this.storage.refFromURL(item.Img).delete()

  }

  async createUserModal() {


    this.modalController.create({
      component: EventCreateComponent,
      //cssClass: 'style-modal-create-event'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  async editEventModal(item: any) {


    //seteo de variables en el form editar
    this.eventsFormEdit.setValue({
      Img: item.Img,
      Nombre: item.Nombre,
      EventoAN: item.EventoAN,
      idEventBooking: item.UidEventBooking,
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

    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: EventEditComponent,
      componentProps: this.eventsFormEdit.value,
      //cssClass: 'style-modal-edite-event'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss().then(res => {
        console.log(res.data)
        //console.log('a', this.eventsFormEdit.value)
        if (res.data != null || res.data != undefined) {
          this.presentLoading()
          this.eventsFormEdit.setValue({
            Img: res.data.Img,
            Nombre: res.data.Nombre,
            EventoAN: res.data.EventoAN,
            idEventBooking: res.data.idEventBooking,
            Reserva: ({
              Descripcion: res.data.Reserva.Descripcion,
              Duracion: res.data.Reserva.Duracion,
              Fecha: res.data.Reserva.Fecha,
              Lugar: res.data.Reserva.Lugar,
              Personas: res.data.Reserva.Personas
            })
          });
          // seteo de valires en el form de editar de reservas
          this.eventsBookingFormEdit.setValue({
            Reserva: ({
              Descripcion: res.data.Reserva.Descripcion,
              Duracion: res.data.Reserva.Duracion,
              Fecha: res.data.Reserva.Fecha,
              Lugar: res.data.Reserva.Lugar,
              Personas: res.data.Reserva.Personas
            })
          })

          //------------
          console.log('b', this.eventsFormEdit.value.Reserva.Duracion)
          console.log('c', this.eventsBookingFormEdit.value.Reserva.Duracion)
          console.log(this.eventsFormEdit.value.idEventBooking)

          //----------------------
          this.collectionEventsBooking.map(res => {
            console.log(res)
            const a = res.id
            const b = res.UidEventBooking
            console.log("a: ", a, "b", b)
            // condicion para actualizar reserva segun el evento
            if (this.eventsFormEdit.value.idEventBooking == b) {
              console.log(b)
              console.log(a)
              this.bookingService.updateBookingServices(a, this.eventsBookingFormEdit.value).then(resp => {
                // funciones de reseteo del formulario y cerrar modal al igual que el formulario
                //this.eventsFormEdit.reset();
  
              }).catch(error => {
                // comprobacion de errores 
                console.error(error);
              });
            }
          })


          // llamado a la variable uid del usuario y verificacion de si es nula o no
          if (this.uidEventEdit !== null || this.uidEventEdit !== undefined) {

            // servicio de acutalizacion de ventos
            this.eventsService.updateEventsServices(this.uidEventEdit, this.eventsFormEdit.value).then(resp => {
              // funciones de reseteo del formulario y cerrar modal al igual que el formulario
              //this.eventsFormEdit.reset();

            }).catch(error => {
              // comprobacion de errores 
              console.error(error);
            });
          }
        }
      })
    });

  }
}
