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

  this.collectionAliquotSeguimiento.getAllAliquotServicesOnlyThisUser().subscribe(resp=>{
    this.collectionAliquotSeguimiento = resp
    this.collectionAliquotSeguimientoLength = resp.length
    //console.log(resp.length)
    //console.log(this.collectionAliquot)
  })
    
  }

  pageChanged(event) {

    // seteo de la configuracion de la pagina actual
    this.config.currentPage = event;
    //console.log(this.config.totalItems)
 
  }

}
