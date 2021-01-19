import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tabhome',
        loadChildren: () => import('./tabhome/tabhome.module').then( m => m.TabhomePageModule)
      },
      {
        path: 'tabevent',
        loadChildren: () => import('./tabevent/tabevent.module').then( m => m.TabeventPageModule)
      },
      {
        path: 'tabchat',
        loadChildren: () => import('./tabchat/tabchat.module').then( m => m.TabchatPageModule)
      },
      {
        path: 'tabaliquot',
        loadChildren: () => import('./tabaliquot/tabaliquot.module').then( m => m.TabaliquotPageModule)
      },
      {
        path: 'tabbooking',
        loadChildren: () => import('./tabbooking/tabbooking.module').then( m => m.TabbookingPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tabhome',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabhome',
    pathMatch: 'full'
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
