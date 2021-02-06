import { Component } from '@angular/core';

// servicio de autenticacion
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  // titulo de la aplicacion
  title = 'HomePlexWeb';

  // llamado al servicio de autenticacion para mostrar o no el navbar en caso de que este autenticado o no
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

}
