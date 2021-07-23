import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  constructor(private angularFireAuth: AngularFireAuth,
              private modalController: ModalController) { }

  ngOnInit() {}

  resetPassword(mail){
    this.angularFireAuth.sendPasswordResetEmail(mail).then(() => {
      this.modalController.dismiss();
    }).catch(err => {
      console.log(err);
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

}
