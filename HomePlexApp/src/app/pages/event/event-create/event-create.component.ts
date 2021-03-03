import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking/booking.service';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent implements OnInit {

  //  numero de personas posibles
  peopleEvent = [
    '1 - 5 personas',
    '5 - 10 personas'
  ]

  // Lugar de los eventos
  placeEvent = [
    'Casa comunal',
    'Canchas deportivas',
    'Parqueadero'
  ]

  // Duracion de eventos con intervalo de 3 horas
  durationEvent = [
    '7 a.m - 10 a.m',
    '10 a.m - 13 p.m',
    '13 p.m - 16 p.m',
    '16 p.m - 19 p.m',
    '19 p.m - 22 p.m'
  ]

  // Estado evento
  statusEvent = [
    'Aprobado',
    'En espera',
    'Desaprobado'
  ]

  // fecha actual
  fechaActual;

  eventBookingDataCreate: any = {};

  // Variables para la subida de imagenes
  imgEdit;
  filepath;
  file;
  fileRef;
  task;
  uploadPercent;

  uidAdmin;
  idAleatorio;
  eventsFormCreate: FormGroup;
  eventsImg: FormGroup;
  eventsBookingFormCreate: FormGroup;

  usersList = [];
  nameUser;





  constructor(private navParams: NavParams,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private usersService: UsersService,
    private eventsService: EventsService,
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
    this.eventsFormCreate = this.formBuilder.group({
      idUser: this.uidAdmin,
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
    // iniciar formulario para la subida de imagenes
    this.eventsImg = this.formBuilder.group({
      Img: ''
    })
    this.eventsBookingFormCreate = this.formBuilder.group({

      idEventBooking: '',
      Ocupado: ['', Validators.required],
      Reserva: this.formBuilder.group({
        Descripcion: ['', Validators.required],
        Lugar: ['', Validators.required],
        Fecha: ['', Validators.required],
        Duracion: ['', Validators.required],
        Personas: ['', Validators.required]
      }),
      UserInfo: this.formBuilder.group({
        userNameReserv: '',
        idUserReserv: '',
      })
    })

  }

  guardar() {
    this.uidAdmin = localStorage.getItem('userId');
    this.idAleatorio = Math.random().toString(36).substring(2);
    this.eventsFormCreate.value.idEventBooking = this.idAleatorio;
    this.eventsFormCreate.value.Reserva.Fecha = this.eventsFormCreate.value.Reserva.Fecha.split('T')[0];
    this.eventsBookingFormCreate.setValue({
      idEventBooking: this.idAleatorio,
      Ocupado: 'Si',
      Reserva: ({
        Descripcion: this.eventsFormCreate.value.Reserva.Descripcion,
        Lugar: this.eventsFormCreate.value.Reserva.Lugar,
        Fecha: this.eventsFormCreate.value.Reserva.Fecha,
        Duracion: this.eventsFormCreate.value.Reserva.Duracion,
        Personas: this.eventsFormCreate.value.Reserva.Personas
      }),
      UserInfo: ({
        userNameReserv: this.nameUser,
        idUserReserv: this.uidAdmin,
      })
    })
    //console.log(this.eventsFormCreate.value)
    //console.log(this.eventsBookingFormCreate.value)
    
    if (this.eventsFormCreate.value.Nombre != '' && this.eventsFormCreate.value.EventoAN != ''
      && this.eventsFormCreate.value.Reserva.Duracion != '' && this.eventsFormCreate.value.Reserva.Descripcion != ''
      && this.eventsFormCreate.value.Reserva.Fecha != '' && this.eventsFormCreate.value.Reserva.Lugar != ''
      && this.eventsFormCreate.value.Reserva.Personas != '' && this.eventsFormCreate.value.Img != '') {
        this.eventsService.createEventsServices(this.eventsFormCreate.value).then(resp => {

            // llamado al servicio de creacion de reservas de acuerdo a los datos del formde reservas igualando datos con el form de de eventos
            this.bookingService.createBookingServices(this.eventsBookingFormCreate.value).then(()=>{
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

  uploadFile(event) {

    // variable random para id de las imagenes
    const idRandom = Math.random().toString(36).substring(2);

    // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store
    this.file = event.target.files[0];

    // establecimiento de la estructura de guardad en store
    this.filepath = 'events/' + idRandom;

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
      this.eventsFormCreate.value.Img = url;
      this.eventsImg.setValue({
        Img: url
      });
    })

  }

}
