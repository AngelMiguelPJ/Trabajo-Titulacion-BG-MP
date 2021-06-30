import { Injectable } from '@angular/core';
import { Plugins, PushNotificationToken } from '@capacitor/core';
import { Platform } from "@ionic/angular";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  //LocalNotificationActionPerformed
} from '@capacitor/push-notifications';
import { IfStmt } from '@angular/compiler';

//const {PushNotifications} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    public platform : Platform
  ) { 
    this.ini();
  }

  ini(){
    if (this.platform.is('desktop')) {
      console.log('es android')
    }  else {
      console.log('no es es android')
    }
    
  }

  listeners(){
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
