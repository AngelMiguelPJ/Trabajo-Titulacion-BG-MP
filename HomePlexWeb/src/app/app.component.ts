import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface user {
  id: string,
  name: string,
  email: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HomePlexWeb';

  // variables
  userUid;
  usersList = [];
  uid;
  nameUser;
  mailUser;

  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,) {
  }

  ngOnInit(): void {

    this.userUid = localStorage.getItem('userId')
    this.usersService.getUsersService().subscribe(users =>{
      this.usersList = users
      for (let index = 0; index < this.usersList.length; index++) {
        const uides = this.usersList[index];
        if (uides.Uid === this.userUid) {
          this.nameUser = uides.Name,
          this.mailUser = uides.Email
        }
        
        
      }
      
    })

  }


  logout() {
    this.authService.logoutService();
  }
}
