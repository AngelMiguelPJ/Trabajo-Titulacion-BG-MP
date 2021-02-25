import { Component, OnInit } from '@angular/core';

import { LoadingController, ModalController } from '@ionic/angular';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AliquotCreateComponent } from './aliquot-create/aliquot-create.component';
import { AliquotEditComponent } from './aliquot-edit/aliquot-edit.component';

@Component({
  selector: 'app-aliquot',
  templateUrl: './aliquot.page.html',
  styleUrls: ['./aliquot.page.scss'],
})
export class AliquotPage implements OnInit {

  // variable para paginacion
  config: any;
  config2: any;
  collectionAliquot;
  collectionAliquotLength;

  //
  selectedSegment: string = 'Mias';
  // coleccion de aliquotas
  collectionAliquotsAll = { count: 0, data: [] }


  // iniciar servicios
  constructor(private aliquotService: AliquotService,
    private loadingController: LoadingController,
    public modalController: ModalController,
    public usersService: UsersService) {
    this.presentLoading()
  }

  ngOnInit() {

    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collectionAliquotLength
    };

    this.config2 = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collectionAliquotsAll.data.length
    };
    // alicuotas para un solo usuario
    this.aliquotService.getAliquotServices().subscribe(resp => {
      this.collectionAliquot = resp
      this.collectionAliquotLength = resp.length
      //console.log(resp.length)
     //console.log(this.collectionAliquot)
    })

    //cargando todos los usuarios de firebase-firestore
    this.aliquotService.getAllAliquotServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de las alicuotas en el arreglo collectionAliquots
      this.collectionAliquotsAll.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          id: e.payload.doc.id,
          DatosVecino: e.payload.doc.data().DatosVecino,
          DatosVecinoNombre: e.payload.doc.data().DatosVecino.Nombre,
          ValorCuota: e.payload.doc.data().ValorCuota,
          ValorExtra: e.payload.doc.data().ValorExtra,
          Fecha: e.payload.doc.data().Fecha,
          FechaVencimiento: e.payload.doc.data().FechaVencimiento,
          EstadoCuota: e.payload.doc.data().EstadoCuota,
          Descripcion: e.payload.doc.data().Descripcion,
          IdAliquot: e.payload.doc.data().IdAliquot
        }
      })
      //console.log(this.collectionAliquotsAll.data)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

  }

  async createAliquotModal() {

    this.modalController.create({
      component: AliquotCreateComponent,
      cssClass: 'modal-create-aliquot'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  async editAliquotModal(item: any) {

    this.modalController.create({
      component: AliquotEditComponent,
      cssClass: 'modal-edit-aliquot',
      componentProps: item,

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }

  pageChanged2(event) {

    // configurar establecida segun el evento
    this.config2.currentPage = event;
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

  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
    this.selectedSegment = ev.target.value;
  }

}
