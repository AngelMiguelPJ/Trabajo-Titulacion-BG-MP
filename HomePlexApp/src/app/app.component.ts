import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Capacitor } from '@capacitor/core';

import { UsersService } from './services/users/users.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

const {PushNotifications, Modals} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public userService : UsersService
  ) {}

  ngOnInit(){
    console.log("Inicio Aplicacion");
    console.log();
    if (isPushNotificationsAvailable) {
      PushNotifications.register();

      PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert("Push registro exitoso, token: " + token.value);
        console.log("Push registro exitoso, token: " + token.value);
        this.guardarToken(token.value);
      }
      );

      PushNotifications.addListener('registrationError',
      (error : any) => {
        alert("Error de registro: " + JSON.stringify(error));
      }
      );

      PushNotifications.addListener('pushNotificationReceived',
      (notification : PushNotification) => {
        let audio1 = new Audio('assets/test.mp3');
        console.log('Audio');
        audio1.play();

        console.log('Push recibido: ', notification);

        let alertRet = Modals.alert({
          title : notification.title,
          message : notification.body
        });
      }
      );

      PushNotifications.addListener('pushNotificationActionPerformed',
      (notification : PushNotificationActionPerformed) => {
        alert('Push  action performed: ' + JSON.stringify(notification));
        console.log('Push  action performed: ', notification);
      }
      );


    }

  }

  async guardarToken(token:any) {
    const Uid =  await this.userService.getId();
    console.log('ID usuario:', Uid);
    if(Uid){
      console.log('Guardar token: ', token );
      // const path : '/users/';
      const userUpdate = {
        token,
      };
      console.log(userUpdate);
      this.userService.updateToken(Uid, userUpdate);
    }
  }
}
