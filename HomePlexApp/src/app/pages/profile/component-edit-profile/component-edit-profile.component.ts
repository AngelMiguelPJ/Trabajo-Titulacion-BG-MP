import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-component-edit-profile',
  templateUrl: './component-edit-profile.component.html',
  styleUrls: ['./component-edit-profile.component.scss'],
})
export class ComponentEditProfileComponent implements OnInit {

  userData: any = {};
  constructor(private modalController: ModalController,
    private popover: PopoverController,
              private navParams: NavParams) {
                
              }

  ngOnInit() {this.userData = this.navParams.data}

  close(name: string, telefono: string){
    if (name != '') {
      this.userData.Name = name
    }
    if (telefono != '') {
      this.userData.Telefono = telefono
    }
    this.popover.dismiss(this.userData)
  }

}
