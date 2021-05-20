import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrashService } from 'src/app/services/trash/trash.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-schedule-tras',
  templateUrl: './schedule-tras.component.html',
  styleUrls: ['./schedule-tras.component.scss']
})
export class ScheduleTrasComponent implements OnInit {
  //varibles
  collectionTrashSchedule;
  scheduleTrasFormEdit: FormGroup;

  // variables de estado
  closeResult = '';
  actualizar: boolean;
  idScheduleTrash;

  constructor(private trashService: TrashService,
    public usersService: UsersService,
    public formBuilder: FormBuilder,
    private ngbModal: NgbModal) { }

  ngOnInit(): void {

    // datos de horarios de basura
    this.trashService.getTrashScheduleServices().subscribe(resp => {
      //console.log(resp);
      this.collectionTrashSchedule = resp.map((e: any) => {
        //console.log('respuesta 2: ', e)
        return {
          id: e.payload.doc.id,
          titulo: e.payload.doc.data().Titulo,
          descripcion: e.payload.doc.data().Descripcion,
          dia: e.payload.doc.data().Dia,
          hora: e.payload.doc.data().Hora
        }

      })
      //console.log(this.collectionTrashSchedule)
    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    // iniciar formulario
    this.scheduleTrasFormEdit = this.formBuilder.group({
      Hora: '',
      Descripcion: '',
    });

  }

  openEditar(contentEdit,item) {
    //console.log(item)
    this.scheduleTrasFormEdit.setValue({
      Hora: item.hora,
      Descripcion: item.descripcion
    })

    this.actualizar = true;
    this.idScheduleTrash = item.id;

    // Apertura del modal para el formulario
    this.ngbModal.open(contentEdit, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
      );
  }

    // metodo de descartamiento de ngmodl y form
    private getDismissReason(reason: any): string {

      // metodo de descarte por boton esc, dar click en otra parte o en la x del formulario
      if (reason === ModalDismissReasons.ESC) {
        this.scheduleTrasFormEdit.reset();
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        this.scheduleTrasFormEdit.reset();
        return 'by clicking on a backdrop';
      } else {
        this.scheduleTrasFormEdit.reset();
        return `with: ${reason}`;
      }
    }

  updateSchedule() {
    if (this.scheduleTrasFormEdit.value.Descripcion !== '') {
      this.trashService.updateTrashScheduleServices(this.idScheduleTrash, this.scheduleTrasFormEdit.value).then(resp =>{
        this.scheduleTrasFormEdit.reset();
        this.ngbModal.dismissAll();
        
      }).catch(error => {
        console.error(error);
      });
    }
  }

}
