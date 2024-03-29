import { Injectable } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  userUid;
  // contructor para iniciar servicios
  constructor(private angularFirestore: AngularFirestore) { }

  // Metodo -funcion -servicio para obtener las reservas
  getBookingServices() {
    return this.angularFirestore.collection('booking').snapshotChanges();
  }

  getBookingServicesUser() {

    this.userUid = localStorage.getItem('userId')
    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('booking', ref => ref.where('UserInfo.idUserReserv', '==', this.userUid)).snapshotChanges().pipe(map(res => {
      //console.log(res)  
      return res.map(a => {
        const data = a.payload.doc.data()
        return data
      })
    }))
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
}

