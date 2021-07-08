import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

// servicios de alicuotas

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AliquotService } from 'src/app/services/aliquot/aliquot.service';
@Component({
  selector: 'app-aliquots',
  templateUrl: './aliquots.component.html',
  styleUrls: ['./aliquots.component.scss']
})
export class AliquotsComponent implements OnInit {

 // variable para paginacion
 config: any;
 collectionAliquot;
 collectionAliquotLength;

 // iniciar servicios
 constructor(private aliquotService: AliquotService,
   public usersService: UsersService,) { }



 ngOnInit(): void {

   // configuracion de la paginacion
   this.config = {
     itemsPerPage: 2,
     currentPage: 1,
     totalItems: this.collectionAliquotLength
   };

   this.aliquotService.getAllAliquotServicesOnlyThisUser().subscribe(resp=>{
     this.collectionAliquot = resp
     this.collectionAliquotLength = resp.length
     //console.log(resp.length)
     //console.log(this.collectionAliquot)
   })

 }

 // metodo funcion para el cambio de pagina
 pageChanged(event) {

   // seteo de la configuracion de la pagina actual
   this.config.currentPage = event;
   //console.log(this.config.totalItems)

 }


}
