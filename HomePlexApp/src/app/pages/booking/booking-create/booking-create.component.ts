import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss'],
})
export class BookingCreateComponent implements OnInit {

  collectionUsers = { count: 0, data: [] }

   //  numero de personas posibles
  peopleBooking = [
    '1 - 5 personas',
    '5 - 10 personas'
  ]

  // Lugar de los Booking
  placeBooking = [
    'Casa comunal',
    'Canchas deportivas',
    'Parqueadero'
  ]

  // Duracion de Bookingo con intervalo de 3 horas
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

  bookingBookingDataCreate: any = {};


  uidAdmin;
  idAleatorio;
  bookingFormCreate: FormGroup;

  usersList = [];
  nameUser;
  constructor(private bookingService: BookingService,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController) { }


  ngOnInit() {

    // seteo de la fecha actual
    this.fechaActual = Date.now();
    this.uidAdmin = localStorage.getItem('userId');
    //iniciar formulario para la creacion de reservas
    this.bookingFormCreate = this.formBuilder.group({
      idUser: this.uidAdmin,
      
      BookingAN: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Duracion: ['', Validators.required],
        Fecha: ['', Validators.required],
        Lugar: ['', Validators.required],
        Personas: ['', Validators.required]
      })
    });
    //console.log('a', this.bookingFormCreate.value)


    //console.log('b', this.bookingDataCreate)

    //cargando todos los usuarios de firebase-firestore
    this.usersService.getUsersServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionUsers.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          //Nombre: e.payload.doc.data().Name,
          uidUser: e.payload.doc.id
        }
      })
      //console.log(this.collectionUsers.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }


  createBooking() {
    this.uidAdmin = localStorage.getItem('userId');
    const idBookingRandom = Math.random().toString(36).substring(2);
    this.bookingFormCreate.value.idBookingBooking = idBookingRandom;
    this.bookingFormCreate.value.Reserva.Fecha = this.bookingFormCreate.value.Reserva.Fecha.split('T')[0];
    if (
      this.bookingFormCreate.value.BookingAN != ''
      && this.bookingFormCreate.value.Reserva.Duracion != ''
      && this.bookingFormCreate.value.Reserva.Descripcion != ''
      && this.bookingFormCreate.value.Reserva.Fecha != ''
      && this.bookingFormCreate.value.Reserva.Lugar != ''
      && this.bookingFormCreate.value.Reserva.Personas != '') {
      console.log(this.bookingFormCreate.value)

      this.bookingService.createBookingServices(this.bookingFormCreate.value).then(resp => {

         //llaamado al servicio de creacion  de reservas
        this.bookingService.createBookingServices(this.bookingFormCreate.value).then(() => {
          this.modalController.dismiss({
            'dismissed': true
          });
        })


      }).catch(error => {
        console.log(this.bookingFormCreate)
        console.error(error)
      })

    } else {
      console.log('no recibe nada');
      console.log(this.bookingFormCreate)
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
      color: 'primary',

    });
    toast.present();
  }

}
