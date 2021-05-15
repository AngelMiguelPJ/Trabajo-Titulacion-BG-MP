import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleTrashPageRoutingModule } from './schedule-trash-routing.module';

import { ScheduleTrashPage } from './schedule-trash.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleTrashPageRoutingModule
  ],
  declarations: [ScheduleTrashPage]
})
export class ScheduleTrashPageModule {}
