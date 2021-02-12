import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // variables para el mapeo de datos para este usuario actual
  usersList = [];
  name;
  imgProfile;


  constructor(public usersService: UsersService,
              public authService: AuthService,
              private navController: NavController) {}

  ngOnInit() {

    this.usersService.getOnlyThisUser().subscribe(res =>{
      // console.log(res)
      res.map(resp =>{
          this.name = resp['Name'];
          this.imgProfile = resp['Img']      
      })
     // console.log(this.name)
    })

  }

    // funcion - metodo para cerrar sesion
    logout() {

      // llamado al servio de cerrado de sesion
      this.authService.logoutService();
  
    }

}
