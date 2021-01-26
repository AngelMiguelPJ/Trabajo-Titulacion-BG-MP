import { Component, OnInit } from '@angular/core';


// routeo
import { Router } from '@angular/router';
// servicio de login
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  // funcion de login
  login(email, password) {

    this.authService.loginService(email, password).then(res => {
      console.log("Respuesta: ", res)
      this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/home"]));
    }).catch(err => {
      console.log("Error: ", err)
    })
  }



}
