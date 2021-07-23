import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { SplashScreen } from '@capacitor/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

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
  aliquotCurrentMonthLenght;
  aliquotLastMonth;
  aliquotLastMonthLenght;

  // variable de recarga de pagina
  recargaPagina;

<<<<<<< HEAD

  

  constructor(public usersService: UsersService,
<<<<<<< HEAD
    public authService: AuthService,
    private navController: NavController,
    public alertController: AlertController,
    private loadingController: LoadingController,){
       this.presentLoading()
    }
  

  ngOnInit() {
    // Schedule a single notification
// Schedule delayed notification
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log(token.value);
        alert('Push registration success, token: ' + token.value);
      },
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );
=======
              public authService: AuthService,
              private navController: NavController,
              public alertController: AlertController,
              private loadingController: LoadingController,
              private eventsService: EventsService,
              private aliquotService: AliquotService,
              private router: Router,
              private angularFireAuth: AngularFireAuth) {

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.recargaPagina = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // inicializacion del sistema de carousel de eventos
        this.option = {
          slidesPerView: 1.2,
          centeredSlides: true,
          loop: true,
          spaceBetween: 5,
          autoplay: true,
          initialSlide: 1.5,
        };

        // inicializacion del sistema de carousel de contactos
        this.option2 = {
          slidesPerView: 5,
          centeredSlides: true,
          loop: true,
          spaceBetween: 1,
          autoplay: false,
          initialSlide: 2.5,
        };
        this.obtenerDatosEventos();
        this.obtenerDatosUsuarios();
        this.obtenerDatosUsuarioActual();
        this.obtenerDatosAlicuotaActual();
        this.obtenerDatosAlicuotaUltima();
      }
    });

  }

  ngOnInit() {
>>>>>>> bf548c2973693248e7e5b7d82b0a236ddaf3ff35

  }

  async obtenerDatosEventos() {

    // servicio para traer los eventos
    await this.eventsService.getAllEventsFilterServices().subscribe(res => {
      // console.log('eventos',res)
      this.eventos = res;
      this.eventosLength = this.eventos.length;
      // console.log(this.eventos.length)
    });


  }
=======

  constructor(public usersService: UsersService,
              public authService: AuthService,
              private navController: NavController,
              public alertController: AlertController,
              private loadingController: LoadingController,
              private eventsService: EventsService,
              private aliquotService: AliquotService,
              private router: Router,
              private angularFireAuth: AngularFireAuth) {

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.recargaPagina = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // inicializacion del sistema de carousel de eventos
        this.option = {
          slidesPerView: 1.2,
          centeredSlides: true,
          loop: true,
          spaceBetween: 5,
          autoplay: true,
          initialSlide: 1.5,
        };

        // inicializacion del sistema de carousel de contactos
        this.option2 = {
          slidesPerView: 5,
          centeredSlides: true,
          loop: true,
          spaceBetween: 1,
          autoplay: false,
          initialSlide: 2.5,
        };
        this.obtenerDatosEventos();
        this.obtenerDatosUsuarios();
        this.obtenerDatosUsuarioActual();
        this.obtenerDatosAlicuotaActual();
        this.obtenerDatosAlicuotaUltima();
      }
    });

  }

  ngOnInit() {

  }

  async obtenerDatosEventos() {

    // servicio para traer los eventos
    await this.eventsService.getAllEventsFilterServices().subscribe(res => {
      // console.log('eventos',res)
      this.eventos = res;
      this.eventosLength = this.eventos.length;
      // console.log(this.eventos.length)
    });


  }
>>>>>>> bf548c2973693248e7e5b7d82b0a236ddaf3ff35
  async obtenerDatosUsuarios() {

    // Servicio para traer los contactos sin el usuario actual como en chat
    await this.usersService.getAllUsersWithoutThisUser().subscribe(res => {
      // console.log(res)
      this.users = res;
      this.usersLength = this.users.length;
    });

  }

  async obtenerDatosUsuarioActual() {

    // traer unicamente datos del usuario actua;
    await this.usersService.getOnlyThisUser().subscribe(res => {
      // console.log(res)
      res.map(resp => {
        this.name = resp.Name;
        this.imgProfile = resp.Img;
      });
      // console.log(this.name)
    });
  }

  async obtenerDatosAlicuotaActual() {

    // traer cuota del mes actual del usuario
    await this.aliquotService.getAliquotUserCurrentMonth().subscribe(res => {
      // console.log(res.length);
      this.aliquotCurrentMonth = res;
      this.aliquotCurrentMonthLenght = res.length;
      // console.log(this.aliquotCurrentMonth.lenght)
    });
  }

  async obtenerDatosAlicuotaUltima() {

    // traer cuota del mes actual del usuario
    await this.aliquotService.getAliquotUserLastMonth().subscribe(res => {
      // console.log(res);
      this.aliquotLastMonth = res;
      this.aliquotLastMonthLenght = res.length;
      // console.log(this.aliquotCurrentMonth)
    });
  }

  ngOnDestroy() {
    if (this.recargaPagina) {
      this.recargaPagina.unsubscribe();
    }
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
          this.angularFireAuth.signOut().then(() => {

            // cambio del estado de si esta logeado o no
            // this.isAuthenticated = false;
            localStorage.removeItem('userId');
            localStorage.clear();
            // redirreccion de rutas para cuando cierra sesion
            // this.router.navigate(['/tabs/tabhome'])

          }).then(() => {
            this.router.navigateByUrl('/login');
          });
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
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
<<<<<<< HEAD

  gotoChatRoom(uid, name, img) {
    sessionStorage.setItem('uidContact', uid);
    sessionStorage.setItem('nameContact', name);
    sessionStorage.setItem('imgContact', img);
    this.navController.navigateForward('/chatroom');
  }

  gotoCreateBooking() {
    this.navController.navigateForward('/booking');
  }

=======

  gotoChatRoom(uid, name, img) {
    sessionStorage.setItem('uidContact', uid);
    sessionStorage.setItem('nameContact', name);
    sessionStorage.setItem('imgContact', img);
    this.navController.navigateForward('/chatroom');
  }

  gotoCreateBooking() {
    this.navController.navigateForward('/booking');
  }

>>>>>>> bf548c2973693248e7e5b7d82b0a236ddaf3ff35


}
