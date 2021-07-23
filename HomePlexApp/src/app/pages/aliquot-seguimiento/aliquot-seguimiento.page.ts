import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AliquotSeguimientoCreateComponent } from './aliquot-seguimiento-create/aliquot-seguimiento-create.component';
import { AliquotSeguimientoEditComponent } from './aliquot-seguimiento-edit/aliquot-seguimiento-edit.component';


@Component({
  selector: 'app-aliquot-seguimiento',
  templateUrl: './aliquot-seguimiento.page.html',
  styleUrls: ['./aliquot-seguimiento.page.scss'],
})
export class AliquotSeguimientoPage implements OnInit {

  //
  config: any;
  collectionAliquotSeguimiento;
  collectionAliquotSeguimientoLength;

  constructor(private aliquotSeguimientoService: AliquotSeguimientoService,
    public usersService: UsersService,
    private loadingController: LoadingController,
    public modalController: ModalController,) { }

  ngOnInit() {
    this.config = {
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: this.collectionAliquotSeguimientoLength
  };

  this.aliquotSeguimientoService.getPaymentTracking().subscribe(resp => {

    this.collectionAliquotSeguimientoLength = resp.length

    this.collectionAliquotSeguimiento = resp.map((e: any) => {
      //console.log('respuesta 2: ', e.payload.doc.data())
      // return que devolvera los datos a collection
      return {
        // seteo de los principales datos que se obtendran de los usuarios
        // y que se reflejaran para el administrador
        Anio: e.payload.doc.data().Anio,
        ValorCuota: e.payload.doc.data().ValorCuota,
        Descripcion: e.payload.doc.data().Descripcion,
        Estado: e.payload.doc.data().Estado,
        Fecha: e.payload.doc.data().Fecha,
        Mes: e.payload.doc.data().Mes,
        Total: e.payload.doc.data().Total,
        id: e.payload.doc.id,

      }
    })
  })
  }

  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }

  async createAliquotSeguimientoModal() {

    this.modalController.create({
      component: AliquotSeguimientoCreateComponent,
      //cssClass: 'modal-create-aliquot'

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

  async editAliquotSeguimientoModal(item: any) {

    this.modalController.create({
      component: AliquotSeguimientoEditComponent,
      //cssClass: 'modal-edit-aliquot',
      componentProps: item,

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }

}
