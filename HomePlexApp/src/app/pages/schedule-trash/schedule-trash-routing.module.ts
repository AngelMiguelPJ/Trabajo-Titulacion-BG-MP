import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleTrashPage } from './schedule-trash.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleTrashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleTrashPageRoutingModule {}
