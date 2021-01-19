import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabbookingPageRoutingModule } from './tabbooking-routing.module';

import { TabbookingPage } from './tabbooking.page';
import { BookingPageModule } from 'src/app/pages/booking/booking.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingPageModule,
    TabbookingPageRoutingModule
  ],
  declarations: [TabbookingPage]
})
export class TabbookingPageModule {}
