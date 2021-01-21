import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth/auth.guard';
import { NologinGuard } from '../guards/nologin/nologin.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tabhome',
        loadChildren: () => import('./tabhome/tabhome.module').then( m => m.TabhomePageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tabevent',
        loadChildren: () => import('./tabevent/tabevent.module').then( m => m.TabeventPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tabchat',
        loadChildren: () => import('./tabchat/tabchat.module').then( m => m.TabchatPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tabaliquot',
        loadChildren: () => import('./tabaliquot/tabaliquot.module').then( m => m.TabaliquotPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tabbooking',
        loadChildren: () => import('./tabbooking/tabbooking.module').then( m => m.TabbookingPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule),
        canActivate : [NologinGuard]
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
