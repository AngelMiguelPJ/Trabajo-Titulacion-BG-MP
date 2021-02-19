import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userData: any = {};
  constructor(private modalController: ModalController,
    private popover: PopoverController,
    private navParams: NavParams) { }

  ngOnInit() {
    this.userData = this.navParams.data
  }

  close(){
    console.log(this.userData)
    this.popover.dismiss(this.userData)
  }

}
