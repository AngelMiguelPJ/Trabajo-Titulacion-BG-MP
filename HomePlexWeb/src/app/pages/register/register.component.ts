import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsersService, UsersExport } from 'src/app/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { isTemplateExpression, isTemplateSpan } from 'typescript';
import { isNullOrUndefined } from 'util';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  typeUsers = [
    '',
    'Contador',
    'Administrador',
    'Vecino',
    'Arrendatario'
  ]
  closeResult = '';

  usersFormEdit: FormGroup;
  usersFormCreate: FormGroup;

  idFirabaseActualizar: string;
  actualizar: boolean;
  
  constructor(private usersService: UsersService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) {

  }
  config: any;
  collection = { count: 0, data: [] }
  ngOnInit(): void {
    this.idFirabaseActualizar = "";
    this.actualizar = false;

    //inicializando formulario para guardar los estudiantes
    this.usersFormCreate = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      TipoUsuario:['', Validators.required]
    });
    //
    this.usersFormEdit = this.fb.group({
      TipoUsuario: ['', Validators.required],
    });
    //cargando todos los estudiantes de firebase
    this.usersService.getUsersServices().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          Uid: e.payload.doc.data().Uid,
          Name: e.payload.doc.data().Name,
          Email: e.payload.doc.data().Email,
          TipoUsuario: e.payload.doc.data().TipoUsuario,
          idFirebase: e.payload.doc.id
        }
      })
      console.log(this.collection)
    },
      error => {
        console.error(error);
      }
    );
  }

  eliminar(item: any): void {
    this.usersService.deleteUsersServices(item.idFirebase);
  }

  registerUsers(Email, Password, Name, TipoUsuario) {
    this.usersService.registerUsersService(Email, Password, Name, TipoUsuario).then(resp => {
      this.usersFormCreate.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error)
      this.usersFormCreate.reset();
      
    })
  }



  openEditar(content, item: any) {

    //llenar form para editar
    this.usersFormEdit.setValue({
     TipoUsuario: item.TipoUsuario,
    });
    this.idFirabaseActualizar = item.idFirebase;
    
    this.actualizar = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  open(contentCreate) {
    this.actualizar = false;
    this.modalService.open(contentCreate, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  actualizarEstudiante() {
    
    if (!isNullOrUndefined(this.idFirabaseActualizar)) {
      this.usersService.updateUsersServices(this.idFirabaseActualizar, this.usersFormEdit.value).then(resp => {
        this.usersFormEdit.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });
    }
  }

  






}
