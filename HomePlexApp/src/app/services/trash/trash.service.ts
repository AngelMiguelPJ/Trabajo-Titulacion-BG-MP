import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrashService {

  dia;

  constructor(private angularFirestore: AngularFirestore) { }

  getTrashScheduleServices() {
    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('trash').snapshotChanges();
  }

  // Metodo -funcion -servicio de actualizacion de datos del evento por id y el campos a actualizar
  updateTrashScheduleServices(idTrash: any, trashSchedule: any) {
    return this.angularFirestore.collection("trash").doc(idTrash).update(trashSchedule);
  }

  getTrashScheduleServicesNow() {
    const fechaComoCadena = new Date(); // día lunes
    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const numeroDia = new Date(fechaComoCadena).getDay();
    this.dia = dias[numeroDia];
    
    console.log("Nombre de día de la semana: ", this.dia);


    //userUid del usuario actual obtenido en el inicio de sesion
    return this.angularFirestore.collection('trash', ref => ref.where('Dia', '==', this.dia)).snapshotChanges().pipe(map(res => {
      //console.log(res)  
      return res.map(a => {
        const data = a.payload.doc.data()
        return data
      })
    }))
  }
}
