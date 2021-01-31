import { Component, OnInit } from '@angular/core';

// routeo y servicio de login
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  // contructor para iniciar los servicios
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  // funcion-metodo de login mediante email y contraseña
  login(email, password) {

    // llamado al servicio de authenticacion para logearse
    this.authService.loginService(email, password).then(res => {
      
      //console.log("Respuesta: ", res)
      // redireccion a la pagina home si se logea correctamente
      this.router.navigate(["/home"]);

    }).catch(err => {

      // mensaje de error en consola
      console.log("Error: ", err)

      })

  }

}
