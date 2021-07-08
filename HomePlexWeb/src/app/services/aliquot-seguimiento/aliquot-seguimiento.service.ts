import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AliquotSeguimientoService {

  // servicios de firebase

  userUid;
  constructor(private angularFirestore: AngularFirestore) { }

  // Motodo -funcion -servicio para la optencion de alicuotas
  getPaymentTracking() {
    return this.angularFirestore.collection('paymentTracking').snapshotChanges()
  }
  // Metodo -funcion -servicio de actualizacion de datos de alicuotas por id y datos
  updatePaymentTracking(idAliquot: any, aliquots: any) {
    return this.angularFirestore.collection("paymentTracking").doc(idAliquot).update(aliquots);
  }

  // Metodo -funcion -servicio de creacion de alicuotas
  createPaymentTracking(aliquots: any) {
    return this.angularFirestore.collection("paymentTracking").add(aliquots)
  }

  // Metodo -funcion -servicio de creacion de respaldo de alicuotas
  createPaymentTrackingBackUp(aliquots: any){
    return this.angularFirestore.collection("paymentTrackingBackUp").add(aliquots)
  }

  // Metodo -funcion -servicio de eliminacion de alicuotas por id
  deletePaymentTracking(idAliquot: any) {
    return this.angularFirestore.collection("paymentTracking").doc(idAliquot).delete();
  }
}