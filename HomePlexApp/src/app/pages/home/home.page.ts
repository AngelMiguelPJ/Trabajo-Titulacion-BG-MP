import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';
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
  eventos;
  eventosLength;
  users;
  usersLength;
  mesActual;
  mesEvento;
  option;
  option2;
  aliquotCurrentMonth;
  aliquotLastMonth;
 

  constructor(public usersService: UsersService,
    public authService: AuthService,
    private navController: NavController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private eventsService: EventsService,
    private aliquotService: AliquotService) {


  }

  ngOnInit() {

    this.option = {
      slidesPerView: 1.2,
      centeredSlides: true,
      loop: false,
      spaceBetween: 5,
      autoplay: true,
      initialSlide: 1.5,
    }
    this.option2 = {
      slidesPerView: 5,
      centeredSlides: true,
      loop: true,
      spaceBetween: 1,
      autoplay: false,
      initialSlide: 2.5,
    }

    this.eventsService.getAllEventsFilterServices().subscribe(res => {
      //console.log('eventos',res)
      this.eventos = res;
      this.eventosLength = this.eventos.length
      //console.log(this.eventos.length)
      
    })
    this.usersService.getAllUsersWithoutThisUser().subscribe(res => {
      //console.log(res)
      this.users = res;
      this.usersLength = this.users.length
    })
    this.usersService.getOnlyThisUser().subscribe(res => {
      // console.log(res)
      res.map(resp => {
        this.name = resp['Name'];
        this.imgProfile = resp['Img']
      })
      // console.log(this.name)
    })

    this.aliquotService.getAliquotUserCurrentMonth().subscribe(res=>{
      //console.log(res);
      this.aliquotCurrentMonth = res;
      console.log(this.aliquotCurrentMonth)
    })
    this.aliquotService.getAliquotUserLastMonth().subscribe(res=>{
      //console.log(res)
      this.aliquotLastMonth = res;
      console.log(this.aliquotLastMonth)
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
          // console.log('Confirm Okay')
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
  gotoChatRoom(uid, name, img) {

    sessionStorage.setItem('uidContact', uid)
    sessionStorage.setItem('nameContact', name)
    sessionStorage.setItem('imgContact', img)
    this.navController.navigateForward("/chatroom");

  }



}
