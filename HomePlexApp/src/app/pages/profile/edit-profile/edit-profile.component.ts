import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { UsersService } from 'src/app/services/users/users.service';
import { last, switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  userProfileFormEdit: FormGroup;
  usersList = [];
  nameUser;
  userImgEdit: FormGroup;
  imgProfile;
  mailUser;
  userUid;
  typeUser;
  houseUser;
  typeUsers = [
    'Contador',
    'Administrador',
    'Vecino',
    'Arrendatario'
  ]
    //  variables para establecer la subia de imagenes
    filepath;
    file;
    fileRef;
    task;
    uidUser;

  constructor(
    private modalController: ModalController,
    private router: Router,
    public fb: FormBuilder,
    private storage: AngularFireStorage,
    private popover: PopoverController,
    public alertCtrl: AlertController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    private usersService: UsersService,
    public toastController: ToastController) { }

  ngOnInit() {

    this.usersService.getOnlyThisUser().subscribe(res => {
      this.usersList = res
      res.map(resp => {
        this.imgProfile = resp['Img'],
        this.nameUser = resp['Name'],
        this.mailUser = resp['Email'],
        this.houseUser = resp['Casa']
        
        })
      console.log(this.usersList)
    }),
    this.userImgEdit = this.fb.group({
      Img: ['']
    }),
    this.userProfileFormEdit = this.formBuilder.group({
      Name: this.navParams.data[0].Name,
      Telefono: this.navParams.data[0].Telefono,
      Email : this.navParams.data[0].Email,
      Casa : this.navParams.data[0].Casa,
      TipoUsuario : this.navParams.data[0].TipoUsuario
    })
    
    console.log(this.navParams.data[0].Uid)
    this.uidUser = this.navParams.data[0].Uid

  }

  async message(message:string) {
    const alert = await this.alertCtrl.create({
      header : 'Cambio contraseña',
      message: message,
      buttons: ['OK']
    })
    await alert.present();
  }

  async changePassword(){
    const alert = await this.alertCtrl.create({
      header : 'Cambiar de contraseña',
      subHeader : 'Por motivos de seguridad ingresa tu contraseña actual',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Escribe tu antigua contraseña...',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'Nueva Contraseña..',
          type: 'password'
        },
        {
          name: 'newPasswordConfirm',
          placeholder: 'Confirna tu nueva contraseña..',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
         {
          text: 'Guardar',
          handler: data => {
                
            //First you get the current logged in user
            const cpUser = firebase.auth().currentUser; 

            /*Then you set credentials to be the current logged in user's email
            and the password the user typed in the input named "old password"
            where he is basically confirming his password just like facebook for example.*/
            const credentials = firebase.auth.EmailAuthProvider.credential(
              cpUser.email, data.oldPassword);

              //Reauthenticating here with the data above
              cpUser.reauthenticateWithCredential(credentials).then(
                success => {
                  if (data.Name !== null && data.Name !== "" ) {
                    cpUser.updateProfile({
                      displayName: data.Name
                    })
                    .then((data) => {
                      console.log(data);
                      //this.presentToast();
                    })
                    .catch(err => {
                      console.log(` failed ${err}`);
                    });
                    console.log('Funciona');
                  }
                  if(data.newPassword != data.newPasswordConfirm){
                    this.message('No cinciden las contraseñas');

                  } else if(data.newPassword.length < 6){
                    this.message('Debe contener al menos 6 caracteres');

                  } else {
                    
                    this.message('Tu contraseña se actualizo correctamente');
                    
                  /* Update the password to the password the user typed into the
                    new password input field */
                  cpUser.updatePassword(data.newPassword).then(function(){
                    //Success
                  }).catch(function(error){
                    //Failed
                  });
                  }
                },
                error => {
                  console.log(error);
                  if(error.code === "auth/wrong-password"){
                    this.message('La contraseña antigua no es correcta');

                  }
                }
              )
              console.log(credentials); 
            }
          }
      ]
    })
    await alert.present();
  }
  
  async updateUser() {
    console.log(this.userProfileFormEdit.value)
    // llamado a la variable uid del usuario y verificacion de si es nula o no
    if (this.uidUser !== null || this.uidUser !== undefined) {
      if (this.userProfileFormEdit.value.Name != '' && this.userProfileFormEdit.value.Telefono != '') {
        // llamado al servicio de actualizacion de usuarios setenado el uid y los valores del usuario actual
        this.usersService.updateUsersServices(this.uidUser, this.userProfileFormEdit.value).then(() => {

          // funciones de reseteo del formulario y cerrar modal al igual que el formulario
          this.modalController.dismiss({
            'dismissed': true
          });

        }).catch(error => {
          // comprobacion de errores 
          console.error(error);
        });
      } else {
        this.presentToast();
      }
    }



  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: ' <b style="text-align:center">Debe llenar todos los datos</b>',
      duration: 1000,
      color: 'primary',

    });
    toast.present();
  }

  goBack() {
    this.modalController.dismiss({
      'dismissed': true
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

  myFunction(number : number){
    
    switch (number) {
      case 1:
        alert('Solo dministradores pueden cambiar el correo electronico')
        break;
      case 2:
        alert('Solo dministradores pueden cambiar la casa')
      break;
      case 3:
        alert('Solo dministradores pueden cambiar el tipo de usuario')
      break;
      default:
        break;
    }

  }
}
