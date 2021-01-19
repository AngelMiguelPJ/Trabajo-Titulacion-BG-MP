import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AliquotPage } from './aliquot.page';

const routes: Routes = [
  {
    path: '',
    component: AliquotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AliquotPageRoutingModule {}
