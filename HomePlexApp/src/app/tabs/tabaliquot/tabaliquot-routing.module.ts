import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabaliquotPage } from './tabaliquot.page';

const routes: Routes = [
  {
    path: '',
    component: TabaliquotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabaliquotPageRoutingModule {}
