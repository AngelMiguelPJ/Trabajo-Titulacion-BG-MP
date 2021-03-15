import { Component, OnInit, } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { last, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usersList = [];


  imgProfile;
  emailUser;
  nameUser;
  phoneUser;
  passwordUser;
  typeUser;
  houseUser;
  userImgEdit: FormGroup;
  //  variables para establecer la subia de imagenes
  filepath;
  file;
  fileRef;
  task;
  userUid;


  usersFormEdit: FormGroup;

  constructor(public usersService: UsersService,
    private navController: NavController,
    private router: Router,
    public popoverController: PopoverController,
    public fb: FormBuilder,
    private storage: AngularFireStorage,
    public modalController: ModalController,
    public authService: AuthService,
    private angularFireAuth: AngularFireAuth,) { }

  ngOnInit() {

    this.usersService.getOnlyThisUser().subscribe(res => {
      //console.log(res)
      this.usersList = res
      res.map(resp => {
        this.imgProfile = resp['Img'],
          this.emailUser = resp['Email'],
          this.nameUser = resp['Name'],
          this.phoneUser = resp['Telefono'],
          this.houseUser = resp['Casa'],
          this.typeUser = resp['TipoUsuario']
      })
      //console.log(this.usersList)
    })

    this.userImgEdit = this.fb.group({
      Img: ['']
    })

  }

  changePass(){
    this.angularFireAuth.updateCurrentUser
  }

  goHome() {
    this.router.navigateByUrl('/home')
  }

  goRegister() {
    this.router.navigateByUrl('/register')
  }

  async presentPopover() {

    //console.log(this.usersFormEdit.value)
    this.modalController.create({
      component: EditProfileComponent,
      
      componentProps: this.usersList,
    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss()
    });

  }

  uploadFile(event) {

    // seteo de las variables que sirven para subir y descargar el url de la imagen subida a store
    this.file = event.target.files[0];
    // establecimiento de la estructura de guardad en store
    this.filepath = 'usersImgProfile/' + this.nameUser + '/' + 'photoPerfil';

    // tareas y referencia del path 
    this.fileRef = this.storage.ref(this.filepath);
    this.task = this.storage.upload(this.filepath, this.file);

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
      this.userUid = localStorage.getItem('userId')
      this.usersService.updateUsersServicesImg(this.userUid, this.userImgEdit.value)

    })

  }




}
