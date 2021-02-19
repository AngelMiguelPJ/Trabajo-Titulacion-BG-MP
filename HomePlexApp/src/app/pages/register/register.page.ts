import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserComponent } from './create-user/create-user.component';


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
  ]

  // variable para introducir datos y respectivo conteo
  collection = { count: 0, data: [] }
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
    private loadingController: LoadingController) { }

  ngOnInit() {

    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collection.data.length,
    }

    this.userUid = localStorage.getItem('userId')
    this.usersFormCreate = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      TipoUsuario: ['', Validators.required]
    });
    //inicializando formulario para guardar los datos del usuario
    this.usersFormEdit = this.fb.group({
      TipoUsuario: ['', Validators.required],
    });

    //cargando todos los usuarios de firebase-firestore
    this.usersService.getUsersServices().subscribe(resp => {
      //console.log(resp.length)
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
        }

      })

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );
  }

  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }

  goProfile() {
    this.router.navigate(['/profile'])
  }

  async actualizar(val: string, Uid: string) {

    const loading = await this.loadingController.create({
      message: 'Cambios guardados',
      duration: 100,
      translucent: true
    });
    await loading.present();


    this.usersFormEdit.setValue({
      TipoUsuario: val,
    });
    //console.log(this.usersFormEdit.value)
    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (Uid !== null || Uid !== undefined) {

      // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
      this.usersService.updateUsersServices(Uid, this.usersFormEdit.value).then(() => {
        loading.dismiss();
      }

      )
    }




  }


  // funcion-metodo de eliminar el usuario de la base de datos
  eliminar(item: any): void {

    // llamado al servicio de eliminacion de usuarios
    this.usersService.deleteUsersServices(item.idFirebase);

  }

  async createUserPopover() {
    
    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: CreateUserComponent,
      cssClass: 'modal-create-user',
      componentProps: this.usersFormCreate.value,
      
    }).then(modalres =>{
      modalres.present();
      modalres.onDidDismiss().then(res =>{
        //console.log(res.data)
        if (res.data != null || res.data != undefined) {
          this.presentLoading()
          //console.log(res.data.Email)
          this.usersService.registerUsersService(res.data.Email, res.data.Password, res.data.Name, res.data.TipoUsuario)
          }
      })
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
    //console.log('Loading dismissed!');
  }




}
