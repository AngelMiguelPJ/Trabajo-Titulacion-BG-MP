import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    // variables
    userUid;
    usersList = [];
    //
    uiduser;
    nameUser;
    mailUser;
    photoUser;
    phoneUser;
    TypeUser;
    houseUser;

  constructor(public authService: AuthService,
    public usersService: UsersService,
    private angularFirestore: AngularFirestore,) { }

  ngOnInit(): void {
    this.userUid = localStorage.getItem('userId')
    this.usersService.getUsersService().subscribe(users => {
      this.usersList = users
      console.log(this.usersList)
      for (let index = 0; index < this.usersList.length; index++) {
        const uides = this.usersList[index];
        if (uides.Uid === this.userUid) {
          this.nameUser = uides.Name,
            this.mailUser = uides.Email,
            this.photoUser = uides.Img,
            this.phoneUser = uides.Telefono,
            this.TypeUser = uides.TipoUsuario,
            this.houseUser = uides.Casa,
            this.uiduser - uides.id
        }
      }
    })
  }

}
