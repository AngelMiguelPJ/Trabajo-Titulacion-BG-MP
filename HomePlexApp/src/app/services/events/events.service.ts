import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private angularFirestore: AngularFirestore) { }

  //
  getEventsServices(){
    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('events').snapshotChanges();
  }

  // Metodo -funcion -servicio de actualizacion de datos del evento por id y el campos a actualizar
  updateEventsServices(idEvent: any, events: any) {
    return this.angularFirestore.collection("events").doc(idEvent).update(events);
  }

  // Metodo -funcion -servicio de creacion de eventos
  createEventsServices(events: any) {
    return this.angularFirestore.collection("events").add(events)
  }

  // Metodo - funcion -servicio de eliminacion de eventos por id
  deleteEventsServices(idEvent: any) {
    return this.angularFirestore.collection("events").doc(idEvent).delete();
  }

  // Metodo - funcion - servicio de actualizacion de la imagen de cada evento
  updateEventsServicesImg(id:any, users:any){
    return this.angularFirestore.collection("events").doc(id).update(users);
  }

}
