import { Component, OnInit } from '@angular/core';

// routeo
import { Router } from '@angular/router';
// servicio de login
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variables
  email: string;
  password: string;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  // funcion de login
  login(){
    this.authService.loginService(this.email, this.password).then( res =>{
      this.router.navigate(['/tabs/tabhome'])
      
    }).catch(err => alert('datos incorrectos o  no existe el usuario'))
  }

}
