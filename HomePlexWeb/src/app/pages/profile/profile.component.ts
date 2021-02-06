//importacion de librerias a usar
import { Component, OnInit } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

// servicio de autenticacion y usuarios
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

// importacion de librerias y servicios extra
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  // variables para el mapeo de datos para este usuario actual
  userUid;
  usersList = [];

  // Variables para el seteo de los datos del usuario actual y reflejarlos en html
  nameUserInfor;
  uidUserInfor;
  emailUserInfor;
  phoneUserInfor;
  houseUserInfor;
  typeUserInfor;
  imgUserInfor;

  // Variables para formar grupos collecciones y seteo de datos por formulario
  closeResult = '';
  usersFormEdit: FormGroup;
  userImgEdit: FormGroup;
  idFirabaseActualizar: string;
  actualizar: boolean;
  collection = { count: 0, data: [] }

  //  variables para establecer la subia de imagenes
  filepath;
  file;
  fileRef;
  task;

  // Variables para la carga
  uploadPercent;

  // constructor que inicia los servicios o funciones
  constructor(public authService: AuthService, public usersService: UsersService,
    private angularFirestore: AngularFirestore, private modalService: NgbModal,
    public fb: FormBuilder, private storage: AngularFireStorage) { }


  ngOnInit(): void {

    //iniciar variables de id de usuario y actualizacion
    this.idFirabaseActualizar = "";
    this.actualizar = false;

    //inicializando formulario para guardar los datos del usuario
    this.usersFormEdit = this.fb.group({
      Name: ['', Validators.required],
      Telefono: ['', Validators.required],
      Casa: ['', Validators.required],
    });

    // iniciar el formulario para guardar la imagen del usuario
    this.userImgEdit = this.fb.group({
      Img: ['']
    })

    // variable del seteo del Uid del usuario actual
    this.userUid = localStorage.getItem('userId')

    // llamado al servicio de obtencion de usuarios y establecer los datos unicamente
    // del usuario actual apartir del su userUid
    this.usersService.getUsersService().subscribe(users => {

      // igualacion de datos al arreglo usersList
      this.usersList = users;

      // sentencia for para recorrer el arreglo list
      for (let index = 0; index < this.usersList.length; index++) {
        const uides = this.usersList[index];

        // condicion de obtener datos unicamente del usuario actual
        if (uides.Uid === this.userUid) {
          this.nameUserInfor = uides.Name,
            this.uidUserInfor = uides.Uid,
            this.emailUserInfor = uides.Email,
            this.phoneUserInfor = uides.Telefono,
            this.typeUserInfor = uides.TipoUsuario,
            this.houseUserInfor = uides.Casa,
            this.imgUserInfor = uides.Img
          //console.log(this.nameUserInfor)
        }

      }

    })

  }

  // funcion para abrir el ng model y cambiar los datos
  openEditar(content, name: string, telefono: string, casa: string) {

    //llenar form para editar con los datos seteados a partir del formulario
    this.usersFormEdit.setValue({
      Name: name,
      Telefono: telefono,
      Casa: casa,
    });

    // igualacion del uid del usuario actual a la variable id firebase
    this.idFirabaseActualizar = this.uidUserInfor;

    // cambiar el estado de la variable booleana a true
    this.actualizar = true;

    // Apertura del modal para el formulario
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
      );

  }

  //funcion que otorga la funcion de cerrar el modal 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }


  // funcion o metodo actualizar usuario
  actualizarUsuario() {

    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (this.idFirabaseActualizar !== null || this.idFirabaseActualizar !== undefined) {

      // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
      this.usersService.updateUsersServices(this.idFirabaseActualizar, this.usersFormEdit.value).then(resp => {

        // funciones de reseteo del formulario y cerrar modal al igual que el formulario
        this.usersFormEdit.reset();
        this.modalService.dismissAll();

        // comprobacion de errores  
      }).catch(error => {
        console.error(error);
      });

    }

  }

  // Actualizacion de imagen mediante subida del archivo en store de firebase
  uploadFile(event) {

    // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store
    this.file = event.target.files[0];
    // establecimiento de la estructura de guardad en store
    this.filepath = 'usersImgProfile/' + this.nameUserInfor + '/' + 'photoPerfil';

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
      this.userImgEdit.setValue({
        Img: url
      })

      //console.log(this.userImgEdit.value)
      // igualacion de variables y llamado a la funcion o metodo para actuializar la imagen setenado el uid de usuario actual y el url de la imagen que subio
      this.idFirabaseActualizar = this.uidUserInfor;
      this.usersService.updateUsersServicesImg(this.idFirabaseActualizar, this.userImgEdit.value)

    })

  }

}
