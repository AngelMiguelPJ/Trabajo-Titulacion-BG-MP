import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabchatPage } from './tabchat.page';

const routes: Routes = [
  {
    path: '',
    component: TabchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabchatPageRoutingModule {}
