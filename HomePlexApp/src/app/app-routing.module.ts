import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { NologinGuard } from './guards/nologin/nologin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate : [NologinGuard]
  },  
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'aliquot',
    loadChildren: () => import('./pages/aliquot/aliquot.module').then( m => m.AliquotPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'booking',
    loadChildren: () => import('./pages/booking/booking.module').then( m => m.BookingPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/event/event.module').then( m => m.EventPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then( m => m.HistoryPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    pathMatch: 'full',
    canActivate : [AuthGuard]
  },
  {
    path: 'chatroom',
    loadChildren: () => import('./pages/chatroom/chatroom.module').then( m => m.ChatroomPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'schedule-trash',
    loadChildren: () => import('./pages/schedule-trash/schedule-trash.module').then( m => m.ScheduleTrashPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'aliquot-seguimiento',
    loadChildren: () => import('./pages/aliquot-seguimiento/aliquot-seguimiento.module').then( m => m.AliquotSeguimientoPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'aliquot-menu',
    loadChildren: () => import('./pages/aliquot-menu/aliquot-menu.module').then( m => m.AliquotMenuPageModule),
    canActivate : [AuthGuard]
  },







];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
