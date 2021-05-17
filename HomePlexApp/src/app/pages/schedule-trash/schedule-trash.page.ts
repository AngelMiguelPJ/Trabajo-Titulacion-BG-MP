import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TrashService } from 'src/app/services/trash/trash.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ScheduleEditComponent } from './schedule-trash/schedule-edit/schedule-edit.component';

@Component({
  selector: 'app-schedule-trash',
  templateUrl: './schedule-trash.page.html',
  styleUrls: ['./schedule-trash.page.scss'],
})
export class ScheduleTrashPage implements OnInit {

  //varibles
  collectionTrashSchedule;

  constructor(private router: Router, 
              private trashService: TrashService, 
              private modalController: ModalController,
              public usersService: UsersService) { }

  ngOnInit() {

    this.trashService.getTrashScheduleServices().subscribe(resp =>{
      //console.log(resp);
      this.collectionTrashSchedule = resp.map((e: any) =>{
        //console.log('respuesta 2: ', e)
        return{
          id: e.payload.doc.id,
          titulo: e.payload.doc.data().Titulo,
          descripcion: e.payload.doc.data().Descripcion,
          dia: e.payload.doc.data().Dia,
          hora: e.payload.doc.data().Hora
        }

      })
      console.log(this.collectionTrashSchedule)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }
  goHome() {
    this.router.navigateByUrl('/home')
  }

  async editScheduleTrashModal(item: any) {

    this.modalController.create({
      component: ScheduleEditComponent,
      //cssClass: 'modal-edit-aliquot',
      componentProps: item,

    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss();
    });

  }


}
