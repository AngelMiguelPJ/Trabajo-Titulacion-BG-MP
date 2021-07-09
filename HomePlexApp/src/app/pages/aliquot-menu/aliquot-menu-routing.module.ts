import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AliquotMenuPage } from './aliquot-menu.page';

const routes: Routes = [
  {
    path: '',
    component: AliquotMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AliquotMenuPageRoutingModule {}
