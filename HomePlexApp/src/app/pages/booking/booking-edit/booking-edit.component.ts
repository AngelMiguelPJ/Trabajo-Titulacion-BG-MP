import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.scss'],
})
export class BookingEditComponent implements OnInit {

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
  bookingBookingDataCreate: any = {};

  // Variables para la subida de imagenes
  imgEdit;
  filepath;
  file;
  fileRef;
  task;
  uploadPercent;
  bookingImgForm: FormGroup;



  constructor(private navParams: NavParams,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public toastController: ToastController) { }

  ngOnInit() {

    // seteo de la fecha actual
    this.fechaActual = Date.now()
    //console.log(this.navParams.data)
    this.bookingBookingDataCreate = this.navParams.data
    console.log(this.bookingBookingDataCreate.Reserva.Lugar)
  }

  guardar() {
    //console.log(this.bookingBookingDataCreate)
    this.modalController.dismiss(this.bookingBookingDataCreate)
  }

  cancelar(){
    this.modalController.dismiss();
  }


}
