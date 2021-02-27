import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // variables para el mapeo de datos para este usuario actual
  usersList = [];
  name;
  imgProfile;
  option = {
    slidesPerView: 1.2,
    centeredSlides: true,
    loop: false,
    spaceBetween: 5,
    autoplay:true,
    initialSlide: 1.5,
  }

  constructor(public usersService: UsersService,
    public authService: AuthService,
    private navController: NavController,
    public alertController: AlertController,
    private loadingController: LoadingController,){
       this.presentLoading()
    }

  ngOnInit() {
    // Schedule a single notification
// Schedule delayed notification

    this.usersService.getOnlyThisUser().subscribe(res => {
      // console.log(res)
      res.map(resp => {
        this.name = resp['Name'];
        this.imgProfile = resp['Img']
      })
      // console.log(this.name)
    })

  }

  
  // funcion - metodo para cerrar sesion
   logout() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Cerrar sesion';
    alert.message = '';
    alert.buttons = [
      {
        text: 'No',
        
      }, {
        text: 'Salir',
        handler: () => {
          this.authService.logoutService();
          console.log('Confirm Okay')
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();


    
    // llamado al servio de cerrado de sesion
    

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }

}
