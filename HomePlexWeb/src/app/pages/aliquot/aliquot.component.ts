import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

// servicios de alicuotas
import { AliquotService } from '../../services/aliquot/aliquot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-aliquot',
  templateUrl: './aliquot.component.html',
  styleUrls: ['./aliquot.component.scss']
})
export class AliquotComponent implements OnInit {

  // variable de configuracion para la paginacion
  config: any;

  // coleccion de aliquotas
  collectionAliquots = { count: 0, data: [] }

  // iniciar servicios
  constructor(private aliquotService: AliquotService,
    public usersService: UsersService,) { }

  // id usuario actual
  idUserCurrent;

  ngOnInit(): void {

     //configuracion para la paginación
     this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: this.collectionAliquots.data.length
    };
 
    //-----------------------------------------------------------------
    // variable del seteo del Uid del usuario actual
    this.idUserCurrent = localStorage.getItem('userId')

    //cargando todos los usuarios de firebase-firestore
    this.aliquotService.getAliquotServices().subscribe(resp => {
      //console.log('respuesta 1: ', resp)
      // mapeo de los datos de las alicuotas en el arreglo collectionAliquots
      this.collectionAliquots.data = resp.map((e: any) => {
        // console.log('respuesta 2: ', e)
        // return que devolvera los datos a collection
        return {
          // seteo de los principales datos que se obtendran de los usuarios
          // y que se reflejaran para el administrador

          IdUser: e.payload.doc.data().DatosVecino.id,
          id: e.payload.doc.id,
          DatosVecinoNombre: e.payload.doc.data().DatosVecino.Nombre,
          ValorCuota: e.payload.doc.data().ValorCuota,
          ValorExtra: e.payload.doc.data().ValorExtra,
          Fecha: e.payload.doc.data().Fecha,
          FechaVencimiento: e.payload.doc.data().FechaVencimiento,
          EstadoCuota: e.payload.doc.data().EstadoCuota,
          Descripcion: e.payload.doc.data().Descripcion,
          IdAliquot: e.payload.doc.data().IdAliquot
        }

      })
      console.log(this.collectionAliquots.data.length)

    }, error => {
      // imprimir en caso de que de algun error
      console.error(error);
    }
    );

  }

  // metodo funcion para el cambio de pagina
  pageChanged(event) {

    // seteo de la configuracion de la pagina actual
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }

}
