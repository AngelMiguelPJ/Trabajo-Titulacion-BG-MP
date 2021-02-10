import { Injectable } from '@angular/core';

// servicios de firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class AliquotService {

  //
  userUid;

  // contructor para iniciar servicios
  constructor(private angularFirestore: AngularFirestore) { }

   // Metodo -funcion -servicio para obtener usuarios mediante el mapeo y asi usar variable por variable

  // Motodo -funcion -servicio para la optencion de alicuotas
  getAliquotServices(){

    this.userUid = localStorage.getItem('userId')
    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('aliquot', ref => ref.where('DatosVecino.uidUser', '==', this.userUid)).snapshotChanges().pipe(map(res=>{
      //console.log(res)  
      return res.map(a=>{
        const data = a.payload.doc.data()
        return data
      })  
    }))
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
