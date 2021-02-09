import { Injectable } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class AliquotService {

  // contructor para iniciar servicios
  constructor(private angularFirestore: AngularFirestore) { }

  // Motodo -funcion -servicio para la optencion de alicuotas
  getAliquotServices() {
    return this.angularFirestore.collection('aliquot').snapshotChanges()
  }

  // Metodo -funcion -servicio de actualizacion de datos de alicuotas por id y datos
  updateAliquotServices(idAliquot: any, aliquots: any) {
    return this.angularFirestore.collection("aliquot").doc(idAliquot).update(aliquots);
  }

  // Metodo -funcion -servicio de creacion de alicuotas
  createAliquotServices(aliquots: any) {
    return this.angularFirestore.collection("aliquot").add(aliquots)
  }

  // Metodo -funcion -servicio de creacion de respaldo de alicuotas
  createAliquotBackupServices(aliquots: any) {
    return this.angularFirestore.collection("aliquotBackup").add(aliquots)
  }

  // Metodo -funcion -servicio de eliminacion de alicuotas por id
  deleteAliquotServices(idAliquot: any) {
    return this.angularFirestore.collection("aliquot").doc(idAliquot).delete();
  }

}
