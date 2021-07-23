import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { last, map } from 'rxjs/operators';

export interface event {
  Nombre: '';
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  mesActual;
  datos;
  constructor(private angularFirestore: AngularFirestore) { }
  getAllEventsFilterServices() {

    return this.angularFirestore.collection('events', ref => ref.orderBy('Reserva.Fecha').limit(3)).snapshotChanges().pipe(map(res => {
      // console.log('eventos 1',res)
      return res.map(b => {
        // console.log(b.payload.doc.data())
        return b.payload.doc.data();
      });
    }));
  }
  //
  getEventsServices() {
    // userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('events').snapshotChanges();
  }

  // Metodo -funcion -servicio de actualizacion de datos del evento por id y el campos a actualizar
  updateEventsServices(idEvent: any, events: any) {
    return this.angularFirestore.collection('events').doc(idEvent).update(events);
  }

  // Metodo -funcion -servicio de creacion de eventos
  createEventsServices(events: any) {
    return this.angularFirestore.collection('events').add(events);
  }

  // Metodo - funcion -servicio de eliminacion de eventos por id
  deleteEventsServices(idEvent: any) {
    return this.angularFirestore.collection('events').doc(idEvent).delete();
  }

  // Metodo - funcion - servicio de actualizacion de la imagen de cada evento
  updateEventsServicesImg(id: any, users: any) {
    return this.angularFirestore.collection('events').doc(id).update(users);
  }

}
