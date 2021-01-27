import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HomePlexWeb';
  constructor(public authService: AuthService) {}
  ngOnInit(): void {}


}
