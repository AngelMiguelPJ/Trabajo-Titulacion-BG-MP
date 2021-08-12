import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private angularFirestore: AngularFirestore) { }

  // Metodo -funcion -servicio para la obtencion de usuarios mediante snapshotchanges
  getEventsServices() {
    return this.angularFirestore.collection('events').snapshotChanges()
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

  getEventRepeat(fecha: any,duracion: any, lugar: any) {

    

    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('booking').snapshotChanges().pipe(map(res => {
      //console.log(res)
      let notMyArticles = res.filter( (article) => 
        
        (article.payload.doc.data()['Reserva'].Duracion == duracion && article.payload.doc.data()['Reserva'].Fecha == fecha && article.payload.doc.data()['Reserva'].Lugar == lugar)
        
      )
      return notMyArticles.length
      
    }))
  }

}
