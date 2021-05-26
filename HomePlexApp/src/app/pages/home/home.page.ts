import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { SplashScreen } from '@capacitor/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';
import { TrashService } from 'src/app/services/trash/trash.service';
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
  aliquotCurrentMonthLenght;
  aliquotLastMonth;
  aliquotLastMonthLenght;
  collectionTrashSchedule;
  collectionTrasScheduleLenght;

  // variable de recarga de pagina
  recargaPagina;
  dia;


  constructor(public usersService: UsersService,
    public authService: AuthService,
    private navController: NavController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private eventsService: EventsService,
    private aliquotService: AliquotService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trashService: TrashService) {



    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    const fechaComoCadena = new Date(); // día lunes
    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const numeroDia = new Date(fechaComoCadena).getDay();
    this.dia = dias[numeroDia];
    
    console.log("Nombre de día de la semana: ", this.dia);
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
        }

        // inicializacion del sistema de carousel de contactos
        this.option2 = {
          slidesPerView: 5,
          centeredSlides: true,
          loop: true,
          spaceBetween: 1,
          autoplay: false,
          initialSlide: 2.5,
        }
        this.obtenerDatosEventos();
        this.obtenerScheduleTrash();
        this.obtenerDatosUsuarioActual();
        this.obtenerDatosAlicuotaActual();
        this.obtenerDatosAlicuotaUltima();

      }
    });





  }

  ngOnInit() {
    this.obtenerScheduleTrash();

  }

  async obtenerDatosEventos() {

    // servicio para traer los eventos
    await this.eventsService.getAllEventsFilterServices().subscribe(res => {
      //console.log('eventos',res)
      this.eventos = res;
      this.eventosLength = this.eventos.length
      //console.log(this.eventos.length)
    })


  }

  async obtenerScheduleTrash() {


    //---
    this.trashService.getTrashScheduleServicesNow().subscribe(resp=>{
      //console.log(resp)
      this.collectionTrashSchedule = resp;
      this.collectionTrasScheduleLenght = resp.length;
      console.log(this.collectionTrasScheduleLenght)
    })


  }

  async obtenerDatosUsuarioActual() {

    // traer unicamente datos del usuario actua;
    await this.usersService.getOnlyThisUser().subscribe(res => {
      // console.log(res)
      res.map(resp => {
        this.name = resp['Name'];
        this.imgProfile = resp['Img']
      })
      // console.log(this.name)
    })
  }

  async obtenerDatosAlicuotaActual() {

    // traer cuota del mes actual del usuario
    await this.aliquotService.getAliquotUserCurrentMonth().subscribe(res => {
      //console.log(res.length);
      this.aliquotCurrentMonth = res;
      this.aliquotCurrentMonthLenght = res.length;
      //console.log(this.aliquotCurrentMonth.lenght)
    })
  }

  async obtenerDatosAlicuotaUltima() {

    // traer cuota del mes actual del usuario
    await this.aliquotService.getAliquotUserLastMonth().subscribe(res => {
      //console.log(res);
      this.aliquotLastMonth = res;
      this.aliquotLastMonthLenght = res.length;
      //console.log(this.aliquotCurrentMonth)
    })
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
            //this.isAuthenticated = false;
            localStorage.removeItem('userId');
            localStorage.clear();
            // redirreccion de rutas para cuando cierra sesion
            //this.router.navigate(['/tabs/tabhome'])

          }).then(() => {
            this.router.navigateByUrl('/login')
          })
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



  gotoCreateBooking() {
    this.navController.navigateForward("/booking");
  }



}
