// librerias, servicios de uso
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// servicio de usuarios
import { UsersService } from 'src/app/services/users/users.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  // lista de los tipos de usuarios que pueden existir
  typeUsersEdit = [
    'Contador',
    'Administrador',
    'Vecino'
  ]
  typeUsersCreate = [
    'Contador',
    'Vecino'
  ]
  usuarioExist = false;
  urlWhatsApp;
  // variable para cerrar modal-form
  closeResult = '';

  // variable de inicio de los formularios de crear y editar
  usersFormEdit: FormGroup;
  usersFormEditAdmin: FormGroup;
  usersFormCreate: FormGroup;

  // variables de uso de actualizacion y seteo de las Uids de firebase
  idFirabaseActualizar: string;
  actualizar: boolean;
  uidAdminFirebase;

  // variable para introducir datos y respectivo conteo
  collection = { count: 0, data: [] }
  collectionBackUp = { count: 0, data: [] }
  // constructor que inicia lso servicios o funciones
  constructor(private usersService: UsersService, private modalService: NgbModal,
    public fb: FormBuilder,public authService: AuthService,) { }


  ngOnInit(): void {

    //iniciar variables de id de usuario y actualizacion
    this.idFirabaseActualizar = "";
    this.actualizar = false;
    this.usuarioExist = false;
    this.uidAdminFirebase = localStorage.getItem('uidAdmin')
    //console.log(this.uidAdminFirebase)
    //inicializando formulario para guardar datos los usuarios
    this.usersFormCreate = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      Email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      Password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12), Validators.pattern(/^[a-zA-Z0-9_-]{6,12}$/)]],
      Casa: ['', Validators.required],
      TipoUsuario: ['', Validators.required]
    });

    //inicializando formulario para editar los datos los usuarios
    this.usersFormEdit = this.fb.group({
      TipoUsuario: ['', Validators.required],
    });

    this.usersFormEditAdmin = this.fb.group({
      TipoUsuario: ['', Validators.required],
    });

    //cargando todos los usuarios de firebase-firestore
    this.usersService.getUsersServices().subscribe(resp => {

      // mapeo de los datos de los usuarios en el arreglo collection
      this.collection.data = resp.map((e: any) => {

        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          Uid: e.payload.doc.data().Uid,
          Name: e.payload.doc.data().Name,
          Email: e.payload.doc.data().Email,
          TipoUsuario: e.payload.doc.data().TipoUsuario,
          Telefono: e.payload.doc.data().Telefono,
          idFirebase: e.payload.doc.id
        }

      })

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

        //cargando todos los usuarios de firebase-firestore
        this.usersService.getUsersServices().subscribe(resp => {

          // mapeo de los datos de los usuarios en el arreglo collection
          this.collectionBackUp.data = resp.map((e: any) => {
    
            // return que devolvera los datos a collection
            return {
              // seteo de los principales datos que se obtendran de los usuarios
              // y que se reflejaran para el administrador
              Uid: e.payload.doc.data().Uid,
              Name: e.payload.doc.data().Name,
              Email: e.payload.doc.data().Email,
              TipoUsuario: e.payload.doc.data().TipoUsuario,
              Telefono: e.payload.doc.data().Telefono,
              idFirebase: e.payload.doc.id
            }
    
          })
    
        }, error => {
          // imprimir en caso de que de algun error
          console.error(error);
        }
        );

  }

  // funcion-metodo de eliminar el usuario de la base de datos
  eliminar(item: any): void {

    // llamado al servicio de eliminacion de usuarios
    this.usersService.deleteUsersServices(item.idFirebase);

  }

  // funcion-metodo de registro de usuarios por medio de variables
  registerUsers(Email, Password, Name, Casa, TipoUsuario) {

    // llamado al servicio de registro de usuarios seteando dichas variables por medio del formulario
    this.usersService.registerUsersService(Email, Password, Name, Casa, TipoUsuario).then(resp => {

      // funciones de reseteo del formulario y cerrar modal al igual que el formulario
      this.usersFormCreate.reset();
      this.modalService.dismissAll();
      this.usuarioExist = false;

    }).catch(error => {

      // comprobacion de errores  y reseteo del formulario create en caso de error
      console.error(error)
      this.usersFormCreate.reset();
      this.usuarioExist = true;
      this.modalService.dismissAll();
    })

  }

  // funcion para abri el ng model y cambiar los datos
  openEditar(content, item: any) {

    //llenar form para editar con los datos seteados a partir del formulario
    this.usersFormEdit.setValue({
      TipoUsuario: item.TipoUsuario,
    });

    // igualancion del uid del usuario actual a la variable id firebase
    this.idFirabaseActualizar = item.idFirebase;

    // cambiar el estado de la variable booleana a true
    this.actualizar = true;

    // Apertura del modal para el formulario
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        this.usersFormCreate.reset();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.usersFormCreate.reset();
      }
      );
    this.usersFormCreate.reset();

  }


  //funcion para abri el ng model y crear un nuevo usuario
  open(contentCreate) {

    // cambiar el estado de la variable booleana a false
    this.actualizar = false;

    // Apertura del modal para el formulario
    this.modalService.open(contentCreate, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.usersFormCreate.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.usersFormCreate.reset();
    });

  }

  //funcion que otorga la funcion de cerrar el modal 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.usersFormCreate.reset();
      this.usuarioExist = false;
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.usersFormCreate.reset();
      this.usuarioExist = false;
      return 'by clicking on a backdrop';
    } else {
      this.usuarioExist = false;
      this.usersFormCreate.reset();
      return `with: ${reason}`;
    }
  }

  // funcion o metodo actualizar usuario
  actualizarUsuario() {
    if (this.usersFormEdit.value.TipoUsuario == 'Administrador' && this.idFirabaseActualizar != this.uidAdminFirebase) {
      console.log('Nuevo administrador');
      this.usersFormEditAdmin.value.TipoUsuario = 'Vecino';
      if (this.idFirabaseActualizar !== null || this.idFirabaseActualizar !== undefined) {

        // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
        this.usersService.updateUsersServices(this.idFirabaseActualizar, this.usersFormEdit.value).then(resp => {

          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.usersFormEdit.reset();
          

        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
        });
        this.usersService.updateUsersServices(this.uidAdminFirebase, this.usersFormEditAdmin.value).then(resp => {

          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.usersFormEditAdmin.reset();
          this.modalService.dismissAll();
          this.authService.logoutService();

        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
        });
      }
    } else {
      console.log('Cambio de rol')

      // llamado a la variable uid del usuario y verificacion de si es nula o no
      if (this.idFirabaseActualizar !== null || this.idFirabaseActualizar !== undefined) {

        // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
        this.usersService.updateUsersServices(this.idFirabaseActualizar, this.usersFormEdit.value).then(resp => {

          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.usersFormEdit.reset();
          this.modalService.dismissAll();

        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
        });
      }
    }


  }
  comunicar(datos){
    //console.log(datos['Telefono']);
    
    this.urlWhatsApp = 'https://api.whatsapp.com/send?phone=593'+datos['Telefono']+'&text=Buenas,%20necesitar%C3%ADa%20de%20tu%20ayuda%20por%20favor.';

    //console.log(this.urlWhatsApp);
    window.open(this.urlWhatsApp, "_blank");
  }

  async filterList(evt) {
    console.log(evt)
    this.collection.data = this.collectionBackUp.data;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.collection.data = this.collection.data.filter(currentFood => {
      if (currentFood.Name && searchTerm) {
        return (currentFood.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }
}
