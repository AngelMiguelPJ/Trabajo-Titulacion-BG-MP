import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { LogoutGuard } from './guards/logout/logout.guard';
import { AliquotComponent } from './pages/aliquot/aliquot.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate : [LogoutGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [LogoutGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'chatroom',
    component: ChatroomComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'eventos',
    component: EventComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'reservas',
    component: BookingComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'alicuotas',
    component: AliquotComponent,
    canActivate : [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
