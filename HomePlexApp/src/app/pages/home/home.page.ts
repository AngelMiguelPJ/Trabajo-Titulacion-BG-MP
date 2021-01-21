import { Component, OnInit } from '@angular/core';
//
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChildActivationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // variables
  uid;
  emailUser;
  name;

  constructor(private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private navController: NavController) {

    this.uid = localStorage.getItem('userId')
    console.log(this.uid)
      
    // llamado de variables locales para cada usuario
    this.angularFirestore.collection("users").get().subscribe(userData => {
      userData.forEach(childData => {
        if (childData.data()['Uid'] === this.uid) {
          this.name = childData.data()['Name']
          this.emailUser = childData.data()['Email']
          localStorage.setItem('userCurrentName', this.name)
          console.log(this.name)
        }
      })
    })
    

  }


  ngOnInit() {
  }

}
