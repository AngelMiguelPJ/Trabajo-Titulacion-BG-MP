import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';
import { ComponentEditProfileComponent } from './component-edit-profile/component-edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usersList = [];
  
  imgProfile;
  emailUser;
  nameUser;
  currentPopover = null;

  constructor(public usersService: UsersService,
    private navController: NavController,
    private router: Router,
    public popoverController: PopoverController) { }

  ngOnInit() {

    this.usersService.getOnlyThisUser().subscribe(res =>{
      // console.log(res)
      this.usersList = res
      res.map(resp =>{
          this.imgProfile = resp['Img'],
          this.emailUser = resp['Email'],
          this.nameUser = resp['Name']  
      })
      console.log(this.usersList)
    })

  }

  goHome(){
    this.router.navigate(['/tabs/tabhome'])
  }

  async presentPopover(name: string) {
    
    const popover = await this.popoverController.create({
      component: ComponentEditProfileComponent,
      cssClass: 'my-custom-class',
      
      translucent: true,
      componentProps:{
        'NameUsuario': name
      },
      
    });

    
    return await popover.present();
  }






}
