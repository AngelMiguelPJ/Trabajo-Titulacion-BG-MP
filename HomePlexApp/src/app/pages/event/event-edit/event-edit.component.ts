import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {

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
  eventImgForm: FormGroup;



  constructor(private navParams: NavParams,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    public toastController: ToastController) { }

  ngOnInit() {
    this.eventImgForm = this.formBuilder.group({
      Img: ['']
    })

    // seteo de la fecha actual
    this.fechaActual = Date.now()
    //console.log(this.navParams.data)
    this.eventBookingDataCreate = this.navParams.data
    this.imgEdit = this.eventBookingDataCreate.Img;
    // iniciar formulario para la subida de imagenes
  }

  guardar() {
    console.log(this.eventBookingDataCreate)
    this.modalController.dismiss(this.eventBookingDataCreate)
  }

  cancelar(){
    this.modalController.dismiss();
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
      this.imgEdit = url
      this.eventBookingDataCreate.Img = url
      this.eventImgForm.setValue({
        Img: url
      })
    })

  }


}
