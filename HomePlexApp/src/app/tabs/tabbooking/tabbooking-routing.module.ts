import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbookingPage } from './tabbooking.page';

const routes: Routes = [
  {
    path: '',
    component: TabbookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbookingPageRoutingModule {}
