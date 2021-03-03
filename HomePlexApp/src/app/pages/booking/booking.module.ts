import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [BookingPage, BookingCreateComponent, BookingEditComponent],
  exports: [BookingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BookingPageModule {}
