import { Component, OnInit } from '@angular/core';
import { AliquotSeguimientoService } from 'src/app/services/aliquot-seguimiento/aliquot-seguimiento.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent implements OnInit {
   // variable para paginacion
 config: any;
 collectionAliquotSeguimiento;
 collectionAliquotSeguimientoLength;


  constructor(private aliquotSeguimientoService: AliquotSeguimientoService,
    public usersService: UsersService) { }

  ngOnInit(): void {

    // configuracion de la paginacion
   this.config = {
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: this.collectionAliquotSeguimientoLength
  };

  this.aliquotSeguimientoService.getPaymentTracking().subscribe(resp => {

    this.collectionAliquotSeguimientoLength = resp.length

    this.collectionAliquotSeguimiento = resp.map((e: any) => {
      //console.log('respuesta 2: ', e.payload.doc.data())
      // return que devolvera los datos a collection
      return {
        // seteo de los principales datos que se obtendran de los usuarios
        // y que se reflejaran para el administrador
        Anio: e.payload.doc.data().Anio,
        ValorCuota: e.payload.doc.data().ValorCuota,
        Descripcion: e.payload.doc.data().Descripcion,
        Estado: e.payload.doc.data().Estado,
        Fecha: e.payload.doc.data().Fecha,
        Mes: e.payload.doc.data().Mes,
        Total: e.payload.doc.data().Total,
        id: e.payload.doc.id,

      }
    })
  })
    
  }

  pageChanged(event) {

    // seteo de la configuracion de la pagina actual
    this.config.currentPage = event;
    //console.log(this.config.totalItems)
 
  }

}
