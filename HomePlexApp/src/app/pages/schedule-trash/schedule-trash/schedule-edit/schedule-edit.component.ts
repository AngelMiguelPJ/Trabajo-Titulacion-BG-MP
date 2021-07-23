import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TrashService } from 'src/app/services/trash/trash.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.scss'],
})
export class ScheduleEditComponent implements OnInit {

  // variables
  scheduleTrasFormEdit: FormGroup;
  idSchedule;

  constructor(private navParams: NavParams,
    private trashService: TrashService,
    public formBuilder: FormBuilder,
    public usersService: UsersService,
    public modalController: ModalController,
    public toastController: ToastController) { }

  ngOnInit() {
        // seteo de la fecha actual
        //this.fechaActual = Date.now();

        this.idSchedule = this.navParams.data.id;
        //console.log('a', this.IdAliquotUpdate);
        console.log('b',this.navParams.data)
    
        this.scheduleTrasFormEdit = this.formBuilder.group({
          Descripcion: this.navParams.data.descripcion,
          Hora: this.navParams.data.hora
        })
  }

  // cancelar
  cancelar() {
    this.modalController.dismiss();
  }

  //actualizar horario
  updateScheduleTrash(){
    console.log('c',this.scheduleTrasFormEdit.value);

    if (this.scheduleTrasFormEdit.value.Descripcion !== '' && this.scheduleTrasFormEdit.value.Hora !== '') {
      this.trashService.updateTrashScheduleServices(this.idSchedule, this.scheduleTrasFormEdit.value).then(() => {
        this.modalController.dismiss({
          'dismissed': true
        });
      }).catch(error => {
        console.error(error);
      });
    } else{
      this.presentToast();
    }
  }

  // avisar
  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'primary',

    });
    toast.present();
  }

}
