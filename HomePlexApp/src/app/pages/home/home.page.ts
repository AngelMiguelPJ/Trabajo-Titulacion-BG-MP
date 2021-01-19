import { Component, OnInit } from '@angular/core';
//
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

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
      this.emailUser = localStorage.getItem('emailUser');
      console.log(this.emailUser)
      console.log(this.uid)

      
      this.angularFirestore.collection("users").get().subscribe(userData => {
      
        userData.forEach(childData => {
          if (childData.data()['Uid'] === this.uid) {     
              this.name = childData.data()['Name']
              console.log(this.name)
          } 
        })
      })  
      
    }

  
  ngOnInit() {
  }

}
