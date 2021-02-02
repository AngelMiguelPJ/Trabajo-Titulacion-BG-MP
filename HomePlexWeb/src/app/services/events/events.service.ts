import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private angularFirestore: AngularFirestore) { }

  // Motodo-funcion-servicio para la optencion de usuarios mediante snapshotchanges
  // para luego por setear estos datos en un arreglo
  getEventsServices() {
    return this.angularFirestore.collection('events').snapshotChanges()
  }

  // Metodo-funcion-servicio de actualizacion de datos del evento por id y el campos a actualizar
  updateEventsServices(idEvent: any, events: any) {
    return this.angularFirestore.collection("events").doc(idEvent).update(events);
  }

  // Metodo-funcion-servicio de creacion de eventos
  createEventsServices(events: any) {
    return this.angularFirestore.collection("events").add(events)
  }

  // Metodo-funcion-servicio de eliminacion de eventos por id
  deleteEventsServices(idEvent: any) {
    return this.angularFirestore.collection("events").doc(idEvent).delete();
  }

  updateEventsServicesImg(id:any, users:any){
    return this.angularFirestore.collection("events").doc(id).update(users);
  }

}
