import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabhomePage } from './tabhome.page';

const routes: Routes = [
  {
    path: '',
    component: TabhomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabhomePageRoutingModule {}
