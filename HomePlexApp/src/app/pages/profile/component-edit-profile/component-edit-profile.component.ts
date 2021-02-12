import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-component-edit-profile',
  templateUrl: './component-edit-profile.component.html',
  styleUrls: ['./component-edit-profile.component.scss'],
})
export class ComponentEditProfileComponent implements OnInit {
  @Input() NameUsuario: string;

  //
  userUid;
  usersFormEdit: FormGroup;
  constructor(public usersService: UsersService,
    public fb: FormBuilder,
    public popoverController: PopoverController,
   ) {
    }

  ngOnInit() {
    // variable del seteo del Uid del usuario actual
    this.userUid = localStorage.getItem('userId')

    this.usersFormEdit = this.fb.group({
      Name: ['', Validators.required],
      
    });
  }

  actualizarUsuario(nameUser: string) {
    

    this.usersFormEdit.setValue({
      Name: nameUser,

    });
    this.userUid = localStorage.getItem('userId')
    if (this.userUid !== null || this.userUid !== undefined) {
      this.usersService.updateUsersServices(this.userUid, this.usersFormEdit.value)
      this.popoverController.dismiss()
    }
  }
  

}
