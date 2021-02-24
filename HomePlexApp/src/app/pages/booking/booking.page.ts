import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActionSheetController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users/users.service';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  public foodList: any[];
  public foodListBackup: any[];
  users = [];
  constructor(private firestore: AngularFirestore,
    private usersService: UsersService) { }

  ngOnInit() {

    this.usersService.getAllUsersWithoutThisUser().pipe(first()).subscribe(res=>{
      this.foodListBackup = res;
      this.foodList = res;
    })
  }


  async filterList(evt) {
    this.foodList = this.foodListBackup;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.foodList = this.foodList.filter(currentFood => {
      if (currentFood.Name && searchTerm) {
        return (currentFood.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }




}
