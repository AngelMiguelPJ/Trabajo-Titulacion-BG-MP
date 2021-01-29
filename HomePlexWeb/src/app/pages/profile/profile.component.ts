import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isTemplateExpression, isTemplateSpan } from 'typescript';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // variables
  userUid;
  usersList = [];
  //
  nameUserInfor;
  uidUserInfor;
  emailUserInfor;
  phoneUserInfor;
  houseUserInfor;
  typeUserInfor;
  imgUserInfor;
  //
  closeResult = '';
  usersFormEdit: FormGroup;
  idFirabaseActualizar: string;
  actualizar: boolean;
  collection = { count: 0, data: [] }

  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: Router,) { }

  config: any;

  ngOnInit(): void {
    //---------------------------------------
    this.idFirabaseActualizar = "";
    this.actualizar = false;

    //inicializando formulario para guardar los estudiantes
    this.usersFormEdit = this.fb.group({
      Name: ['', Validators.required],
      Telefono: ['', Validators.required],
      Casa: ['', Validators.required],
      //Img: ['', Validators.required]
    });
    //---------------------------------------
    this.userUid = localStorage.getItem('userId')
    //cargando todos los estudiantes de firebase
    

    //--------------------------------------------
    this.usersService.getUsersService().subscribe(users => {
      this.usersList = users;
      for (let index = 0; index < this.usersList.length; index++) {
        const uides = this.usersList[index];
        if (uides.Uid === this.userUid) {
          this.nameUserInfor = uides.Name,
          this.uidUserInfor = uides.Uid,
          this.emailUserInfor = uides.Email,
          this.phoneUserInfor = uides.Telefono,
          this.typeUserInfor = uides.TipoUsuario,
          this.houseUserInfor = uides.Casa,
          this.imgUserInfor = uides.Img
          console.log(this.nameUserInfor)
        }
      }
    })
  }

  openEditar(content, name: string, telefono: string, casa: string) {

    //llenar form para editar
    this.usersFormEdit.setValue({
      Name: name,
      Telefono: telefono,
      Casa: casa,
      //Img: img
    });
    this.idFirabaseActualizar = this.uidUserInfor;

    this.actualizar = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
