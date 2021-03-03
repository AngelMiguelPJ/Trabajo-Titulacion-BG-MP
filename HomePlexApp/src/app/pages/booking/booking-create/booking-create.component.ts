import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking/booking.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss'],
})
export class BookingCreateComponent implements OnInit {

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

  // Variables para la subida de imagenes
  imgEdit;
  filepath;
  file;
  fileRef;
  task;
  uploadPercent;

  uidAdmin;
  idAleatorio;
  bookingFormCreate: FormGroup;

  usersList = [];
  nameUser;


  constructor(private navParams: NavParams,
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private usersService: UsersService,
    private bookingService: BookingService,) { }

  ngOnInit() {
    this.fechaActual = Date.now()
    this.usersService.getOnlyThisUser().subscribe(res => {
      //console.log(res)
      this.usersList = res
      res.map(resp => {
        this.nameUser = resp['Name']
      })
      //console.log(this.usersList)
    })


    this.uidAdmin = localStorage.getItem('userId');
    this.bookingFormCreate = this.formBuilder.group({
      idUser: this.uidAdmin,
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

  }

  guardar() {
    this.uidAdmin = localStorage.getItem('userId');
    this.idAleatorio = Math.random().toString(36).substring(2);
    this.bookingFormCreate.value.idBookingBooking = this.idAleatorio;
    this.bookingFormCreate.value.Reserva.Fecha = this.bookingFormCreate.value.Reserva.Fecha.split('T')[0];

    console.log(this.bookingFormCreate.value)
    
    if (this.bookingFormCreate.value.Nombre != '' && this.bookingFormCreate.value.BookingAN != ''
      && this.bookingFormCreate.value.Reserva.Duracion != '' && this.bookingFormCreate.value.Reserva.Descripcion != ''
      && this.bookingFormCreate.value.Reserva.Fecha != '' && this.bookingFormCreate.value.Reserva.Lugar != ''
      && this.bookingFormCreate.value.Reserva.Personas != '' && this.bookingFormCreate.value.Img != '') {
        this.bookingService.createBookingServices(this.bookingFormCreate.value).then(resp => {

            // llamado al servicio de creacion de reservas de acuerdo a los datos del formde reservas igualando datos con el form de de Bookings
            this.bookingService.createBookingServices(this.bookingFormCreate.value).then(()=>{
              this.modalController.dismiss({
                'dismissed': true
              });
            })
          }).catch(err => {
            // impirmir error si es que diera alguno
            console.log(err)
          })
    } else {
      this.presentToast()
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

  /*uploadFile(event) {

    // variable random para id de las imagenes
    const idRandom = Math.random().toString(36).substring(2);

    // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store
    this.file = event.target.files[0];

    // establecimiento de la estructura de guardad en store
    this.filepath = 'booking/' + idRandom;

    // tareas y referencia del path 
    this.fileRef = this.storage.ref(this.filepath);
    this.task = this.storage.upload(this.filepath, this.file);

    // Observador para ver el porcentaje de subida o tiempo que tarda en subir
    this.uploadPercent = this.task.percentageChanges();

    // obtenr noticicacion de que la url del archivo subido esta diponible y su pertinente obtencion mediante mapeo
    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() =>
        this.fileRef.getDownloadURL()
      )
    ).subscribe(url => {
      // seteo de la variable Img de form para obtenecion la imagen en un arreglo y asi subirla al respectivo campo de Img ela firestore del usuario
      this.imgEdit = url;
      this.bookingFormCreate.value.Img = url;
    })

  }*/ 

}
