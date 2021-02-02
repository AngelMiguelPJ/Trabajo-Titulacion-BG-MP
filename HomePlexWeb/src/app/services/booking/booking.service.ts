import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private angularFirestore: AngularFirestore) { }

  getBookingServices() {
    return this.angularFirestore.collection('booking').snapshotChanges()
  }
  updateBookingServices(idBooking: any, bookings: any) {
    return this.angularFirestore.collection("booking").doc(idBooking).update(bookings);
  }
  createBookingServices(bookings: any) {
    return this.angularFirestore.collection("booking").add(bookings)
  }
  deleteBookingServices(idBooking: any) {
    return this.angularFirestore.collection("booking").doc(idBooking).delete();
  }
}
