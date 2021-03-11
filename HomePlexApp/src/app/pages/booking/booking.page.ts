import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking/booking.service';
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
  uidAdmin;

  collectionBookingBooking;
  collectionBookingBookingLength;
  // variables para establecer id y uid de reservas

  uidBookingEdit;

  // formulario
  bookingFormCreate: FormGroup;
  bookingFormEdit: FormGroup;


  bookingBookingFormCreate: FormGroup;
  bookingBookingFormEdit: FormGroup;

  //
  searchBarOpen = false;
  searchValue = false;


  constructor(private bookingService: BookingService,
    private loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    public usersService: UsersService,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet) { this.presentLoading() }

  ngOnInit() {

    //--------------------------------------------------------
    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.collectionBookingLength
    };
    //--------------------------------------------------------
    //cargando todos los Bookings de firebase-firestore
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
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
    this.bookingService.getBookingServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBookingBooking = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          UidBookingBooking: e.payload.doc.data().idBookingBooking
        }
      })

      //console.log(this.collectionBooking.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
    //--------------------------------------------------------


    // inicializacion de formulario para la edicion de un Booking
    this.bookingFormEdit = this.formBuilder.group({
      idBookingBooking: '',
      BookingAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Duracion: ['', Validators.required],
        Fecha: ['', Validators.required],
        Lugar: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    });



    // Iniciar formulario para la creacion de reservas a partir de datos de un Booking


    ///
    this.bookingBookingFormEdit = this.formBuilder.group({
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
    this.config.currentPage = 1,
    // llamado al servicio de eliminacion de Bookings 
    this.bookingService.deleteBookingServices(item.uidBooking);

    this.collectionBookingBooking.map(res => {
      const a = res.id
      const b = res.UidBookingBooking
      //console.log("a: ", a, "b", b)
      // llamado al servico de eliminacion de reservas 
      if (item.UidBookingBooking == b) {
        this.bookingService.deleteBookingServices(a)
      }
    })



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
    this.bookingFormEdit.setValue({
      
      BookingAN: item.BookingAN,
      idBookingBooking: item.UidBookingBooking,
      Reserva: ({
        Descripcion: item.Descripcion,
        Duracion: item.Duracion,
        Fecha: item.Fecha,
        Lugar: item.Lugar,
        Personas: item.Personas
      })
    });
    // igualancion del uid del usuario actual a la variable id firebase
    this.uidBookingEdit = item.uidBooking;

    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: BookingEditComponent,
      componentProps: this.bookingFormEdit.value,
      //cssClass: 'style-modal-edite-booking'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss().then(res => {
        //console.log(res.data)
        //console.log('a', this.bookingFormEdit.value)
        if (res.data != null || res.data != undefined) {
          this.presentLoading()
          this.bookingFormEdit.setValue({

            BookingAN: res.data.BookingAN,
            idBookingBooking: res.data.idBookingBooking,
            Reserva: ({
              Descripcion: res.data.Reserva.Descripcion,
              Duracion: res.data.Reserva.Duracion,
              Fecha: res.data.Reserva.Fecha,
              Lugar: res.data.Reserva.Lugar,
              Personas: res.data.Reserva.Personas
            })
          });
          // seteo de valires en el form de editar de reservas
          this.bookingBookingFormEdit.setValue({
            Reserva: ({
              Descripcion: res.data.Reserva.Descripcion,
              Duracion: res.data.Reserva.Duracion,
              Fecha: res.data.Reserva.Fecha,
              Lugar: res.data.Reserva.Lugar,
              Personas: res.data.Reserva.Personas
            })
          })

          //------------
          // console.log('b', this.bookingFormEdit.value.Reserva.Duracion)
          // console.log('c', this.bookingBookingFormEdit.value.Reserva.Duracion)
          //console.log(this.bVar)
          //console.log(this.aVar)
          console.log(this.bookingFormEdit.value.idBookingBooking)

          //----------------------
          this.collectionBookingBooking.map(res => {
            const a = res.id
            const b = res.UidBookingBooking
            console.log("a: ", a, "b", b)
            // condicion para actualizar reserva segun el Booking
            if (this.bookingFormEdit.value.idBookingBooking == b) {
              console.log(b)
              console.log(a)
              this.bookingService.updateBookingServices(a, this.bookingBookingFormEdit.value)
            }
          })


          // llamado a la variable uid del usuario y verificacion de si es nula o no
          if (this.uidBookingEdit !== null || this.uidBookingEdit !== undefined) {



            // servicio de acutalizacion de ventos
            this.bookingService.updateBookingServices(this.uidBookingEdit, this.bookingFormEdit.value).then(resp => {
              // funciones de reseteo del formulario y cerrar modal al igual que el formulario
              //this.bookingFormEdit.reset();

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
