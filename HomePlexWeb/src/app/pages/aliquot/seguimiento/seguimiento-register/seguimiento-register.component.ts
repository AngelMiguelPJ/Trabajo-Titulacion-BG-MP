import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-seguimiento-register',
  templateUrl: './seguimiento-register.component.html',
  styleUrls: ['./seguimiento-register.component.scss']
})
export class SeguimientoRegisterComponent implements OnInit {
  // variable de configuracion para la paginacion
  config: any;
  // coleccion de usuarios
  collectionUsers = { count: 0, data: [] }

  // coleccion de aliquotas
  collectionAliquots = { count: 0, data: [] }
  numUser;

  constructor(public usersService: UsersService) { }

  ngOnInit(): void {

    // seteo de las variables de configuracion de la paginacion
    this.config = {
      itemsPerPage: 4,
      currentPage: 1,
      totalItems: this.collectionAliquots.data.length,
    };
    this.usersService.getUsersServices().subscribe(resp => {
      console.log(resp.length);
      this.numUser = resp.length;
    })
  }

  pageChanged(event) {

    // seteo de la configuracion del cambio de pagina
    this.config.currentPage = event;

  }


}
