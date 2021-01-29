import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // variables
  userUid;
  usersList = [];
  uid;
  nameUser;
  mailUser;
  photoUser;
  typeUser;
  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,) { }

  ngOnInit(): void {
    this.userUid = localStorage.getItem('userId')
    this.usersService.getUsersService().subscribe(users => {
      this.usersList = users
      for (let index = 0; index < this.usersList.length; index++) {
        const uides = this.usersList[index];
        if (uides.Uid === this.userUid) {
          this.nameUser = uides.Name,
            this.mailUser = uides.Email,
            this.photoUser = uides.Img,
            this.typeUser = uides.TipoUsuario
        }
      }
    })
  }

  logout() {
    this.authService.logoutService();
  }
}
