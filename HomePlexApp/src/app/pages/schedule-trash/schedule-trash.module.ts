import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleTrashPageRoutingModule } from './schedule-trash-routing.module';

import { ScheduleTrashPage } from './schedule-trash.page';
import { ScheduleEditComponent } from './schedule-trash/schedule-edit/schedule-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleTrashPageRoutingModule
  ],
  declarations: [ScheduleTrashPage,ScheduleEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScheduleTrashPageModule {}
