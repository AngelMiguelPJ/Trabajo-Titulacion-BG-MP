import { Injectable } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BookingService {

  // contructor para iniciar servicios
  constructor(private angularFirestore: AngularFirestore) { }

  // Metodo -funcion -servicio para obtener las reservas
  getBookingServices() {
    return this.angularFirestore.collection('booking').snapshotChanges()
  }

  // Metodo -funcion -servicio para actualizar las reservas de acuerdo al id y datos enviados
  updateBookingServices(idBooking: any, bookings: any) {
    return this.angularFirestore.collection("booking").doc(idBooking).update(bookings);
  }

  // Metodo -funcion -servicio para crear una reserva de acuerdo a los datos enviados
  createBookingServices(bookings: any) {
    return this.angularFirestore.collection("booking").add(bookings)
  }

  // Metodo -funcion -servicio para eliminar las reservas de acuerdo al id
  deleteBookingServices(idBooking: any) {
    return this.angularFirestore.collection("booking").doc(idBooking).delete();
  }
  
  getBookingRepeat(fecha: any,duracion: any, lugar: any) {

    

    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('booking').snapshotChanges().pipe(map(res => {
      //console.log(res)
      let notMyArticles = res.filter( (article) => 
        
        (article.payload.doc.data()['Reserva'].Duracion == duracion && article.payload.doc.data()['Reserva'].Fecha == fecha && article.payload.doc.data()['Reserva'].Lugar == lugar)
        
      )
      return notMyArticles.length
      
    }))
  }

  deleteEvent(idbookingdelete: any) {

    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('events', ref => ref.where('idBookingBooking', '==', idbookingdelete).limit(1)).snapshotChanges().pipe(map(res => {
      //console.log(res)  
      return res.map(a => {
        const data = a.payload.doc.id
        return data
      })
    }))
  }
}
