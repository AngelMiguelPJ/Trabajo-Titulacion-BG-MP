import { Component, OnInit } from '@angular/core';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';

@Component({
  selector: 'app-aliquot',
  templateUrl: './aliquot.page.html',
  styleUrls: ['./aliquot.page.scss'],
})
export class AliquotPage implements OnInit {

  // variable para paginacion
  config: any;
  collectionAliquot;
  collectionAliquotLength;


  // iniciar servicios
  constructor(private aliquotService: AliquotService,) { }

  ngOnInit() {

    // configuracion de la paginacion
    this.config = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.collectionAliquotLength
    };

    this.aliquotService.getAliquotServices().subscribe(resp=>{
      this.collectionAliquot = resp
      this.collectionAliquotLength = resp.length
      //console.log(resp.length)
      //console.log(this.collectionAliquot)
    })

  }

  // funcion-metodo para el cambio de pagina segun la pagina actual
  pageChanged(event) {

    // configurar establecida segun el evento
    this.config.currentPage = event;
    //console.log(this.config.totalItems)

  }



}
