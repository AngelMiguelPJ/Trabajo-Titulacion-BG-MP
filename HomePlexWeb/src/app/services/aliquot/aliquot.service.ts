import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AliquotService {

  constructor(private angularFirestore: AngularFirestore) { }

  // Motodo-funcion-servicio para la optencion de usuarios mediante snapshotchanges
  // para luego por setear estos datos en un arreglo
  getAliquotServices() {
    return this.angularFirestore.collection('aliquot').snapshotChanges()
  }

  // Metodo-funcion-servicio de actualizacion de datos del evento por id y el campos a actualizar
  updateAliquotServices(idAliquot: any, aliquots: any) {
    return this.angularFirestore.collection("aliquot").doc(idAliquot).update(aliquots);
  }

  // Metodo-funcion-servicio de creacion de eventos
  createAliquotServices(aliquots: any) {
    return this.angularFirestore.collection("aliquot").add(aliquots)
  }

  // Metodo-funcion-servicio de creacion de respaldo de alicuotas
  createAliquotBackupServices(aliquots: any) {
    return this.angularFirestore.collection("aliquotBackup").add(aliquots)
  }

  // Metodo-funcion-servicio de eliminacion de eventos por id
  deleteAliquotServices(idAliquot: any) {
    return this.angularFirestore.collection("aliquot").doc(idAliquot).delete();
  }
}
