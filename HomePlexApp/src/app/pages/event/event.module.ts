import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventPageRoutingModule } from './event-routing.module';

import { EventPage } from './event.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [EventPage, EventCreateComponent, EventEditComponent],
  exports: [EventPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class EventPageModule {}
