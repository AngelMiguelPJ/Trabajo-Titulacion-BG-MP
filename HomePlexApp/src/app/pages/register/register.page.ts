import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  typeUsers = [
    'Contador',
    'Administrador',
    'Vecino',
    'Arrendatario'
  ];
  searchBarOpen = false;
  searchValue = false;

  // variable para introducir datos y respectivo conteo
  collection = { count: 0, data: [] };
  collectionBackup = {count: 0, data: []};
  // variable para paginacion
  config: any;
  usersFormEdit: FormGroup;
  usersFormCreate: FormGroup;
  userUid;

  constructor(private usersService: UsersService,
              public modalController: ModalController,
              private router: Router,
              public fb: FormBuilder,
              public popoverController: PopoverController,
              private loadingController: LoadingController,
              private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {

    this.config = {
      itemsPerPage: 4,
      currentPage: 1,
      totalItems: this.collection.data.length,
    };


    // cargando todos los usuarios de firebase-firestore
    this.usersService.getUsersServices().subscribe(resp => {
      // console.log(resp.length)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collection.data = resp.map((e: any) => {

        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          Uid: e.payload.doc.data().Uid,
          Name: e.payload.doc.data().Name,
          Email: e.payload.doc.data().Email,
          Telefono: e.payload.doc.data().Telefono,
          Casa: e.payload.doc.data().Casa,
          TipoUsuario: e.payload.doc.data().TipoUsuario,
          Img: e.payload.doc.data().Img,
          idFirebase: e.payload.doc.id
        };

      });

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

    this.usersService.getUsersServices().subscribe(resp => {
      // console.log(resp.length)
      // mapeo de los datos de los usuarios en el arreglo collection
      this.collectionBackup.data = resp.map((e: any) => {

        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador
          Uid: e.payload.doc.data().Uid,
          Name: e.payload.doc.data().Name,
          Email: e.payload.doc.data().Email,
          Telefono: e.payload.doc.data().Telefono,
          Casa: e.payload.doc.data().Casa,
          TipoUsuario: e.payload.doc.data().TipoUsuario,
          Img: e.payload.doc.data().Img,
          idFirebase: e.payload.doc.id
        };

      });

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }

  async filterList(evt) {
    this.collection.data = this.collectionBackup.data;
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

  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    // console.log(this.config.totalItems)

  }

  goProfile() {
    this.router.navigateByUrl('/profile');
    this.searchBarOpen = false;
    this.searchValue = false;
  }






  // funcion-metodo de eliminar el usuario de la base de datos
  async deleteUser(item: any) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.message = 'Seguro que desea eliminar este usuario';
    alert.buttons = [
      {
        text: 'No',

      }, {
        text: 'Eliminar',
        handler: () => {
          this.usersService.deleteUsersServices(item.idFirebase);
          console.log('Confirm Okay');
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
    // llamado al servicio de eliminacion de usuarios

  }

  async createUserModal() {

    // console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: CreateUserComponent,
      // cssClass: 'modal-create-user'
    }).then(modalres => {
      modalres.present();

      modalres.onDidDismiss().then(() => {
        // this.presentLoading();
      });
    });
  }

  async editUserModal(item: any) {

    // console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: EditUserComponent,
      // cssClass: 'modal-edit-user',
      componentProps: item
    }).then(modalres => {
      modalres.present();

      modalres.onDidDismiss().then(() => {
        // this.presentLoadingSave();
      });

    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Usuario creado',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }
  async presentLoadingSave() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Guardando cambios',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }




}
